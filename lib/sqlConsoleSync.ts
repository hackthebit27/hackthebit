// lib/sqlConsoleSync.ts
//
// Server side of the SQL console's progress sync. The console keeps its state in
// the browser and sends record-level changes here; this module stores them in
// Upstash Redis (reached over its REST API, so no extra dependency) under a key
// derived from the console login.
//
// Every deployment URL of this project (the production domain and each preview
// URL) is a different browser origin with its own localStorage, but they all run
// this same code against the same Redis database. That shared store is what
// carries a learner's progress from one URL or device to another.
import { createHash, timingSafeEqual } from "node:crypto";

// ---------------------------------------------------------------- identity

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) {
    // still spend comparable time, then fail
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/**
 * Re-checks the Basic credentials on the request (middleware.ts has already done
 * so; this keeps the API safe even if the matcher changes) and returns the login
 * name. The owner of the synced state is always derived from verified credentials,
 * never from anything the client says about itself.
 */
export function authenticatedLearner(req: Request): string | null {
  const user = process.env.SQL_CONSOLE_USER;
  const pass = process.env.SQL_CONSOLE_PASSWORD;
  if (!user || !pass) return null;
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return null;
  let decoded = "";
  try {
    decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch {
    return null;
  }
  const sep = decoded.indexOf(":");
  if (sep === -1) return null;
  const okUser = safeEqual(decoded.slice(0, sep), user);
  const okPass = safeEqual(decoded.slice(sep + 1), pass);
  return okUser && okPass ? user : null;
}

/** Storage key for a learner. Hashed so the login name itself is not stored. */
export function learnerKey(login: string) {
  return "sqlc:v1:" + createHash("sha256").update("sql-console:" + login).digest("hex");
}

// ---------------------------------------------------------------- store

type RedisConfig = { url: string; token: string };

export function redisConfig(): RedisConfig | null {
  // Names used by the Vercel Marketplace Upstash integration, then Upstash's own.
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

async function redis(cfg: RedisConfig, command: (string | number)[]) {
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command.map(String)),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as { result?: unknown; error?: string } | null;
  if (!res.ok || !body || body.error) {
    throw new Error("store error: " + (body?.error ?? res.status));
  }
  return body.result;
}

// One atomic step per sync request. Records live in a hash per learner:
//   field  = record key (for example "topicProgress/joins-inner")
//   value  = "<rev>|<json>"   or "<rev>|~" for a deletion
//   __rev  = revision counter, bumped once per accepted write
//   __epoch = random id, recreated if the cloud copy is ever deleted
// A write carries the revision the client last saw for that record ("base"). If
// the stored record is newer, the write is refused and returned as a conflict, so
// the client can merge instead of overwriting something it has not seen.
const SYNC_SCRIPT = `
local h = KEYS[1]
if redis.call('HEXISTS', h, '__epoch') == 0 then
  redis.call('HSET', h, '__epoch', ARGV[1])
end
local epoch = redis.call('HGET', h, '__epoch')
local since = tonumber(ARGV[2])
local n = tonumber(ARGV[3])
local clientEpoch = ARGV[4]
if clientEpoch ~= epoch then since = 0 end
local conflicts = {}
local i = 5
for c = 1, n do
  local k = ARGV[i]
  local base = tonumber(ARGV[i + 1])
  local v = ARGV[i + 2]
  i = i + 3
  if clientEpoch ~= epoch then base = 0 end
  local cur = redis.call('HGET', h, k)
  local curRev = 0
  if cur then curRev = tonumber(string.match(cur, '^(%d+)|')) end
  if curRev > base then
    table.insert(conflicts, k)
  else
    local rev = redis.call('HINCRBY', h, '__rev', 1)
    redis.call('HSET', h, k, rev .. '|' .. v)
  end
end
local top = tonumber(redis.call('HGET', h, '__rev') or '0')
local out = {}
if top > since then
  local all = redis.call('HGETALL', h)
  for j = 1, #all, 2 do
    local f = all[j]
    if f ~= '__rev' and f ~= '__epoch' then
      local r = tonumber(string.match(all[j + 1], '^(%d+)|'))
      if r and r > since then
        table.insert(out, f)
        table.insert(out, all[j + 1])
      end
    end
  end
end
local cf = {}
for _, k in ipairs(conflicts) do
  table.insert(cf, k)
  table.insert(cf, redis.call('HGET', h, k))
end
return {epoch, top, out, cf}
`;

export type SyncChange = { k: string; b: number; v: string | null };
export type SyncRecord = { k: string; r: number; v: string | null };
export type SyncResult = {
  epoch: string;
  rev: number;
  records: SyncRecord[];
  conflicts: SyncRecord[];
};

function splitStored(field: string, stored: string): SyncRecord {
  const bar = stored.indexOf("|");
  const r = Number(stored.slice(0, bar));
  const raw = stored.slice(bar + 1);
  return { k: field, r, v: raw === "~" ? null : raw };
}

function pairs(list: unknown): SyncRecord[] {
  const arr = Array.isArray(list) ? (list as string[]) : [];
  const out: SyncRecord[] = [];
  for (let i = 0; i + 1 < arr.length; i += 2) out.push(splitStored(arr[i], arr[i + 1]));
  return out;
}

export async function runSync(
  cfg: RedisConfig,
  key: string,
  clientEpoch: string,
  since: number,
  changes: SyncChange[],
): Promise<SyncResult> {
  const newEpoch = crypto.randomUUID();
  const args: (string | number)[] = ["EVAL", SYNC_SCRIPT, 1, key, newEpoch, since, changes.length, clientEpoch];
  for (const c of changes) args.push(c.k, c.b, c.v === null ? "~" : c.v);
  const result = (await redis(cfg, args)) as [string, number, string[], string[]];
  return {
    epoch: String(result[0]),
    rev: Number(result[1]),
    records: pairs(result[2]),
    conflicts: pairs(result[3]),
  };
}

export async function deleteLearnerData(cfg: RedisConfig, key: string) {
  await redis(cfg, ["DEL", key]);
}

// ---------------------------------------------------------------- validation

export const LIMITS = {
  maxChanges: 400,
  maxKeyLength: 300,
  maxValueLength: 256 * 1024,
  maxBodyBytes: 900 * 1024,
};

const KEY_PATTERN = /^[A-Za-z0-9_$][A-Za-z0-9_$.%\-]*(\/[A-Za-z0-9_.%\-~!*'()]+)?$/;

export function parseChanges(body: unknown): { since: number; epoch: string; changes: SyncChange[] } | string {
  if (!body || typeof body !== "object") return "body must be an object";
  const b = body as Record<string, unknown>;
  const since = Number(b.since ?? 0);
  if (!Number.isInteger(since) || since < 0) return "bad since";
  const epoch = typeof b.epoch === "string" ? b.epoch.slice(0, 64) : "";
  const list = Array.isArray(b.changes) ? b.changes : [];
  if (list.length > LIMITS.maxChanges) return "too many changes";
  const changes: SyncChange[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") return "bad change";
    const c = raw as Record<string, unknown>;
    const k = c.k;
    const base = Number(c.b ?? 0);
    const v = c.v;
    if (typeof k !== "string" || k.length > LIMITS.maxKeyLength || !KEY_PATTERN.test(k) || k.startsWith("__")) {
      return "bad key";
    }
    if (!Number.isInteger(base) || base < 0) return "bad base";
    if (v !== null && (typeof v !== "string" || v.length > LIMITS.maxValueLength || v === "~")) return "bad value";
    if (typeof v === "string") {
      try {
        JSON.parse(v);
      } catch {
        return "value must be JSON";
      }
    }
    changes.push({ k, b: base, v: v as string | null });
  }
  return { since, epoch, changes };
}

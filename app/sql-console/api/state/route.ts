// app/sql-console/api/state/route.ts
//
// Progress sync for the SQL console. Sits under /sql-console, so middleware.ts
// already requires the console login; the handler checks it again and uses it
// as the owner of the stored progress.
import {
  LIMITS,
  authenticatedLearner,
  deleteLearnerData,
  learnerKey,
  parseChanges,
  redisConfig,
  runSync,
} from "@/lib/sqlConsoleSync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...NO_STORE, "Content-Type": "application/json; charset=utf-8" },
  });
}

// The browser attaches the Basic credentials to any request for this origin, even
// one started by another site. Requiring a custom header and a JSON body means a
// cross-site page would need a CORS preflight, which this route never approves;
// the Origin check covers browsers that send one.
function sameOriginRequest(req: Request) {
  if (req.headers.get("x-sqlc-sync") !== "1") return false;
  const origin = req.headers.get("origin");
  if (origin) {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    try {
      if (new URL(origin).host !== host) return false;
    } catch {
      return false;
    }
  }
  return true;
}

export async function POST(req: Request) {
  if (!sameOriginRequest(req)) return json({ error: "forbidden" }, 403);
  const login = authenticatedLearner(req);
  if (!login) return json({ error: "unauthenticated" }, 401);
  const cfg = redisConfig();
  if (!cfg) return json({ configured: false }, 503);

  const text = await req.text();
  if (text.length > LIMITS.maxBodyBytes) return json({ error: "too large" }, 413);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad json" }, 400);
  }
  const parsed = parseChanges(body);
  if (typeof parsed === "string") return json({ error: parsed }, 400);

  try {
    const result = await runSync(cfg, learnerKey(login), parsed.epoch, parsed.since, parsed.changes);
    return json({ configured: true, ...result });
  } catch {
    // Deliberately no detail: never echo stored data or credentials into logs.
    return json({ error: "store unavailable" }, 502);
  }
}

export async function DELETE(req: Request) {
  if (!sameOriginRequest(req)) return json({ error: "forbidden" }, 403);
  const login = authenticatedLearner(req);
  if (!login) return json({ error: "unauthenticated" }, 401);
  const cfg = redisConfig();
  if (!cfg) return json({ configured: false }, 503);
  try {
    await deleteLearnerData(cfg, learnerKey(login));
    return json({ deleted: true });
  } catch {
    return json({ error: "store unavailable" }, 502);
  }
}

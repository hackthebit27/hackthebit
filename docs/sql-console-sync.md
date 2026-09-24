# SQL console: progress, sync and themes

## What is stored, and where

The console keeps one learner-state object (`STATE` in
`content/sql-console/console.html`, localStorage key
`sql_plsql_mastery_console_state_v1`). Nothing about its shape changed; one
field was added (`lastPosition`, for "Continue where you left off").

| Learner data | Field |
| --- | --- |
| Mastery (6 dimensions) and status per topic | `topicProgress` |
| First completion date per topic | `topicCompletionDates` |
| Notes per topic | `notes` |
| Bookmarks | `bookmarks` |
| SQL / PL/SQL practice | `sqlProblemProgress`, `plsqlProblemProgress` |
| Interview, output-prediction, debugging, design, project progress | `questionAttempts`, `interviewSessions`, `outputQuestionAttempts`, `debuggingAttempts`, `designProgress`, `projectProgress` |
| Study schedule | `scheduleSettings`, `topicPlanRecords`, `dailyScheduleHistory`, `scheduleVersion` |
| Spaced revision | `revisionSchedule` |
| Streak | `streak` |
| Theme preference | `settings.theme` (`system` / `light` / `dark`) |
| Last meaningful position | `lastPosition` |

View filters, search text and scroll position are not stored: they are
per-visit conveniences, and restoring a scroll offset after the content has
been corrected would land in the wrong place.

## Local first

Every change is written to localStorage immediately and the UI never waits on
the network. That copy is what the console runs on, offline included.

## Sync across deployment URLs and devices

Each deployment URL (the production domain and every preview URL) is its own
browser origin with its own localStorage, so localStorage alone can never carry
progress between them. The sync layer does:

- `app/sql-console/api/state/route.ts` is served by every deployment of this
  project, same-origin with the console, so no CORS is involved.
- All of them read and write one Upstash Redis database
  (`lib/sqlConsoleSync.ts`), so progress saved on one URL or device is there on
  the others.
- **Identity** is the console login that `middleware.ts` already requires. The
  API re-verifies the Basic credentials itself, and the storage key is a SHA-256
  of the login name. The client never names an owner; nobody without the login
  can read or write anything.
- Requests must carry `X-SQLC-Sync: 1` and a JSON body, and a cross-origin
  `Origin` is refused. That stops another site from riding on the browser's
  cached credentials.
- No secret is in the client. The Redis URL and token live only in server
  environment variables.

### Records, revisions and conflicts

`STATE` is split into records: one per topic, note, bookmark, problem, schedule
day and so on, plus one per remaining top-level field. Only records that changed
are sent. Each record carries the server revision this browser last saw; the
server applies a write only if that revision is still current (one atomic Lua
script). Otherwise it returns the newer value, and the browser merges:

- **Notes**: never dropped. If two different edits meet, both texts are kept,
  separated by a marked line, on every device.
- **Topic mastery**: a dimension ticked anywhere stays ticked; status is
  recomputed.
- **Completion dates**: the earliest wins (it is a historical fact).
- **Revision history**: the record with more reviews wins.
- **Bookmarks**: union on a device's first sync, then latest edit.
- **Everything else**: on a device's first sync the account's value wins, so a
  fresh browser cannot overwrite real progress with defaults. After that, the
  latest edit wins.

Untouched default topic records (created just by opening a topic) are never
uploaded.

### First sign-in with existing local progress

The first device to sync uploads everything it has. Any later device merges its
local data with the account using the rules above. Nothing is replaced wholesale
in either direction.

### Theme precedence

`settings.theme` is part of the synced state. A browser applies its last-known
preference before first paint (mirrored in
`sql_plsql_mastery_console_theme`), then adopts the account's preference once
synced. On a device's first sync the account's preference wins if it has one.
Learners who already had progress before themes existed keep the dark design
they were using; new learners start on "System".

### Offline, failures, tabs

Offline changes wait in localStorage and go up on reconnect. A failed request
is retried with backoff (5 s, 15 s, 1 min, 5 min) and never discards local
data. Tabs on the same origin pick up each other's pushes through the server.

### Status indicator

The pill in the top bar shows: "Saved on this device" (sync not configured or
off), "Syncing…", "Synced", "Changes waiting to sync", "Offline – saved on this
device", "Sync paused – retrying", or "Sign-in expired – reload".
Settings → Sync & account shows details, "Sync now", turning sync off on one
device, and deleting the synced copy.

## Enabling sync on Vercel

Sync stays off, with progress kept on each device exactly as before, until the
store is configured:

1. Vercel dashboard → the `hackthebit` project → **Storage** → **Create
   Database** → **Upstash for Redis** (Marketplace). The free tier is plenty.
2. Connect it to the project for **Production and Preview**. That adds
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` (`UPSTASH_REDIS_REST_URL` /
   `UPSTASH_REDIS_REST_TOKEN` are also accepted).
3. Redeploy. The status pill should change from "Saved on this device" to
   "Synced".

## Testing

`scripts/sql-console-sync-test/` runs the real app against a local Redis on
three origins. It covers migration of an existing learner, both sync directions,
merging, offline edits, same-note conflicts, store outage, theme sync, two tabs,
a third device, deleting the cloud copy, reset, mobile layout, copy buttons,
keyboard access, and every view in both themes.

# SQL console sync test

End-to-end check of the console's local persistence, cross-origin sync,
offline behaviour, conflict handling and light/dark themes. It is not part of
the site build and has its own dependencies.

```bash
redis-server --port 6390 --daemonize yes      # a throwaway local Redis
cd scripts/sql-console-sync-test && npm install
node upstash-shim.js &                        # Upstash REST API stand-in on :8079

# from the repo root, in another shell
npm run build
SQL_CONSOLE_USER=learner SQL_CONSOLE_PASSWORD=s3cret \
KV_REST_API_URL=http://localhost:8079 KV_REST_API_TOKEN=test-token \
npx next start -p 3001

cd scripts/sql-console-sync-test && node e2e.js   # PW_CHROMIUM=/path/to/chrome to pick a browser
```

`http://localhost:3001`, `http://127.0.0.1:3001` and `http://127.0.0.2:3001`
are three different browser origins with separate localStorage, standing in for
the production domain, a preview URL and a second device. They share one sync
store, as the real deployments do.

The test flushes the Redis it is pointed at, so never point it at a real database.

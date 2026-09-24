// app/sql-console/app/route.ts
import { readFile } from "node:fs/promises";
import path from "node:path";

// Serves the self-contained console. It lives outside public/ so it can only be
// reached through this route, which middleware.ts puts behind a password.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONSOLE_FILE = path.join(process.cwd(), "content/sql-console/console.html");

export async function GET() {
  const html = await readFile(CONSOLE_FILE, "utf8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Frame-Options": "SAMEORIGIN",
      "Content-Security-Policy": "frame-ancestors 'self'",
    },
  });
}

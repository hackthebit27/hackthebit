// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

// Password-protects the private SQL + PL/SQL console and the C++ console. Both
// use the same credentials, SQL_CONSOLE_USER / SQL_CONSOLE_PASSWORD; if either
// is missing the consoles stay locked rather than opening up.

const REALM = "HackTheBit SQL Console";

// Compares every character regardless of where the first mismatch is, so the
// response time does not reveal how much of a guess was right.
function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function deny(status: 401 | 503, body: string) {
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "Content-Type": "text/plain; charset=utf-8",
  };
  if (status === 401) {
    headers["WWW-Authenticate"] = `Basic realm="${REALM}", charset="UTF-8"`;
  }
  return new NextResponse(body, { status, headers });
}

export function middleware(req: NextRequest) {
  const user = process.env.SQL_CONSOLE_USER;
  const pass = process.env.SQL_CONSOLE_PASSWORD;
  if (!user || !pass) return deny(503, "Console is not configured.");

  const header = req.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = new TextDecoder().decode(
        Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0))
      );
    } catch {
      return deny(401, "Authentication required.");
    }
    const sep = decoded.indexOf(":");
    if (sep !== -1) {
      const okUser = safeEqual(decoded.slice(0, sep), user);
      const okPass = safeEqual(decoded.slice(sep + 1), pass);
      if (okUser && okPass) {
        const res = NextResponse.next();
        res.headers.set("X-Robots-Tag", "noindex, nofollow");
        return res;
      }
    }
  }
  return deny(401, "Authentication required.");
}

export const config = {
  matcher: [
    "/sql-console",
    "/sql-console/:path*",
    "/cpp-console",
    "/cpp-console/:path*",
  ],
};

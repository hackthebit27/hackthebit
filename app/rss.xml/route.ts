// app/rss.xml/route.ts
import { NextResponse } from "next/server";
import { blogs } from "@/data/blogs";

// Generate a static RSS every 10 minutes
export const revalidate = 600;         // ISR (10 min)
export const dynamic = "force-static"; // build as static

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hackthebit.com";
const TITLE = "HackTheBit Blog";
const DESCRIPTION = "Learn. Code. Grow.";

// Basic XML escape
const xmlEscape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Strip most Markdown for description
const mdToText = (md: string) => {
  return md
    // remove code fences
    .replace(/```[\s\S]*?```/g, " ")
    // inline code
    .replace(/`([^`]+)`/g, "$1")
    // links: [text](url) -> text
    .replace(/$begin:math:display$([^$end:math:display$]+)\]$begin:math:text$[^)]+$end:math:text$/g, "$1")
    // headings/formatting
    .replace(/(^|\n)#{1,6}\s*/g, "\n")
    .replace(/[*_~>#+\-]+/g, " ")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
};

export async function GET() {
  const items = [...blogs]
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .map((b) => {
      const url = `${SITE_URL}/blog/${b.slug}`;
      const desc = xmlEscape(mdToText(b.content || b.description || ""));
      const title = xmlEscape(b.title);
      const pubDate = new Date(b.date).toUTCString();

      return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${desc}]]></description>
    </item>`;
    })
    .join("\n");

  const lastBuildDate =
    blogs.length > 0
      ? new Date(
          Math.max(...blogs.map((b) => new Date(b.date).getTime()))
        ).toUTCString()
      : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${TITLE}]]></title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${DESCRIPTION}]]></description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo/hackthebit-logo-primary.svg</url>
      <title><![CDATA[${TITLE}]]></title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // cache 10m at the edge, allow 1d stale while revalidating
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
// app/rss.xml/route.ts
import { NextResponse } from "next/server";
import { blogs } from "@/data/blogs";

export async function GET() {
  const host = process.env.NEXT_PUBLIC_SITE_URL || "https://hackthebit.com";

  const items = blogs.map(
    (b) => `
<item>
  <title><![CDATA[${b.title}]]></title>
  <link>${host}/blog/${b.slug}</link>
  <guid>${host}/blog/${b.slug}</guid>
  <pubDate>${new Date(b.date).toUTCString()}</pubDate>
  <description><![CDATA[${b.description || ""}]]></description>
</item>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>HackTheBit Blog</title>
  <link>${host}</link>
  <description>Learn. Code. Grow.</description>
  ${items}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
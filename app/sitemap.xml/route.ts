// app/sitemap.xml/route.ts
import { blogs } from "@/data/blogs";

export async function GET() {
  const host = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hackthebit.com";
  const staticUrls = [
    "",
    "/courses",
    "/mentors",
    "/community",
    "/about",
    "/blog",
  ];

  const pages = staticUrls
    .map(
      (p) => `<url><loc>${host}${p}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
    )
    .join("");

  const posts = blogs
    .map(
      (b) =>
        `<url><loc>${host}/blog/${b.slug}</loc><lastmod>${new Date(
          b.date
        ).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages}
${posts}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
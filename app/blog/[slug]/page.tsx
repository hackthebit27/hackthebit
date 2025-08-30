import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import CopyLinkButton from "@/components/CopyLinkButton";
import TableOfContents from "@/components/TableOfContents";

interface BlogProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.hackthebit.com";

export const revalidate = 60;

// helpers
function stripCodeBlocks(md: string) {
  return md.replace(/```[\s\S]*?```/g, " ");
}
function countWords(text: string) {
  return (text.match(/\b[\w'-]+\b/g) || []).length;
}
function getReadingTimeMinutes(content: string) {
  const plain = stripCodeBlocks(content);
  const words = countWords(plain);
  const minutes = Math.max(1, Math.round(words / 220));
  return { minutes, words };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: BlogProps
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;
  const title = post.title;
  const description =
    post.description || `Read "${post.title}" on HackTheBit — learn, code, grow.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "HackTheBit",
      type: "article",
      publishedTime: post.date,
      authors: ["HackTheBit"],
      images: [{ url: "/logo/hackthebit-logo-primary.svg" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo/hackthebit-logo-primary.svg"],
    },
  };
}

export default async function BlogDetail({ params }: BlogProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const { minutes, words } = getReadingTimeMinutes(post.content);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "HackTheBit" },
    publisher: {
      "@type": "Organization",
      name: "HackTheBit",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/hackthebit-logo-primary.svg`,
      },
    },
    mainEntityOfPage: url,
  };

  const posts = await getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;

  const prettyDate = new Date(post.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    post.title
  )}&url=${encodeURIComponent(url)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-8">
            <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
              📅 {prettyDate}
            </span>
            <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
              ⏱️ {minutes} min read
            </span>
            <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              📝 {words} words
            </span>

            <div className="ml-auto flex items-center gap-2">
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-700 px-3 py-1 rounded-lg transition"
              >
                Share on X
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-700 px-3 py-1 rounded-lg transition"
              >
                Share on LinkedIn
              </a>
              <CopyLinkButton url={url} />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
            <MarkdownRenderer content={post.content} />
          </div>

          <hr className="my-10 border-gray-200" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group inline-flex flex-col bg-white border border-gray-200 hover:border-indigo-300 rounded-xl p-4 w-full sm:w-auto transition"
              >
                <span className="text-xs text-gray-500">← Previous</span>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group inline-flex flex-col bg-white border border-gray-200 hover:border-indigo-300 rounded-xl p-4 w-full sm:w-auto transition ml-auto"
              >
                <span className="text-xs text-gray-500 text-right">Next →</span>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </div>

          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-block text-indigo-700 hover:text-indigo-800 underline underline-offset-2"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 mb-3">
              On this page
            </p>
            <TableOfContents content={post.content} />
          </div>
        </aside>
      </article>
    </main>
  );
}
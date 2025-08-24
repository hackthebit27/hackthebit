// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogs } from "@/data/blogs";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import CopyLinkButton from "@/components/CopyLinkButton";

interface BlogProps {
  // Next.js 15+ supplies params as a Promise in server components
  params: Promise<{ slug: string }>;
}

function stripCodeBlocks(md: string) {
  // remove fenced code blocks to keep reading time realistic
  return md.replace(/```[\s\S]*?```/g, " ");
}

function countWords(text: string) {
  return (text.match(/\b[\w'-]+\b/g) || []).length;
}

function getReadingTimeMinutes(content: string) {
  const plain = stripCodeBlocks(content);
  const words = countWords(plain);
  const minutes = Math.max(1, Math.round(words / 220)); // ~220 wpm
  return { minutes, words };
}

function getNeighbors(slug: string) {
  const idx = blogs.findIndex((b) => b.slug === slug);
  return {
    prev: idx > 0 ? blogs[idx - 1] : null,
    next: idx >= 0 && idx < blogs.length - 1 ? blogs[idx + 1] : null,
  };
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hackthebit.com";

export default async function BlogDetail({ params }: BlogProps) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return notFound();

  const { minutes, words } = getReadingTimeMinutes(blog.content);
  const url = `${SITE_URL}/blog/${blog.slug}`;

  // share links (server-safe)
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    blog.title
  )}&url=${encodeURIComponent(url)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  const { prev, next } = getNeighbors(blog.slug);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          {blog.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-8">
          <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
            📅 {blog.date}
          </span>
          <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
            ⏱️ {minutes} min read
          </span>
          <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            📝 {words} words
          </span>

          {/* Share */}
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

        {/* Content */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
          <MarkdownRenderer content={blog.content} />
        </div>

        {/* Divider */}
        <hr className="my-10 border-gray-200" />

        {/* Prev / Next */}
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
              <span className="text-xs text-gray-500 text-right">
                Next →
              </span>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">
                {next.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Back to blog index */}
        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-block text-indigo-700 hover:text-indigo-800 underline underline-offset-2"
          >
            ← Back to all posts
          </Link>
        </div>
      </article>
    </main>
  );
}

export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}
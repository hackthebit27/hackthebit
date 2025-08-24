// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { blogs } from "@/data/blogs";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface BlogProps {
  // Note: in Next.js 15, params is a Promise in server components
  params: Promise<{ slug: string }>;
}

export default async function BlogDetail({ params }: BlogProps) {
  const { slug } = await params; // ✅ await params
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return notFound();

  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          {blog.title}
        </h1>
        <p className="text-sm text-gray-500 mb-8">{blog.date}</p>
        <MarkdownRenderer content={blog.content} />
      </article>
    </main>
  );
}

// Optional but nice for static builds / faster prod routes
export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

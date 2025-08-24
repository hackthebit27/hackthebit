import { notFound } from "next/navigation";
import { blogs } from "@/data/blogs";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface BlogProps {
  params: { slug: string };
}

export default function BlogDetail({ params }: BlogProps) {
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
      <article className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{blog.date}</p>
        <MarkdownRenderer content={blog.content} />
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { blogs } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Deep dives, guides, and checklists for modern developers — from Python and web dev to C++ best practices.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-6">
      <header className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">📚 Our Blog</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Practical, copy-pasteable posts to help you learn faster and build better.
        </p>
      </header>

      <section className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2">
        {blogs.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition"
          >
            <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{new Date(post.date).toDateString()}</p>
            <p className="text-gray-700 mt-3 line-clamp-3">{post.description}</p>
            <span className="inline-block mt-4 text-indigo-700 font-medium">
              Read post →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
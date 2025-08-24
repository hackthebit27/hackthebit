import Link from "next/link";
import { blogs } from "@/data/blogs";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
          📚 HackTheBit Blog
        </h1>

        <div className="grid gap-6">
          {blogs.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition bg-white"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 mb-3">{post.date}</p>
              <p className="text-gray-800">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

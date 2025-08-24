import Link from "next/link";

const blogs = [
  {
    slug: "why-learn-python",
    title: "Why Learn Python in 2025?",
    description: "Discover why Python remains one of the best programming languages for beginners and pros alike.",
    date: "Aug 23, 2025",
  },
  {
    slug: "webdev-trends-2025",
    title: "Web Development Trends in 2025",
    description: "A look into modern frameworks, AI-powered tools, and what’s shaping the future of web development.",
    date: "Aug 20, 2025",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
        📚 Our Blog
      </h1>
      <div className="max-w-4xl mx-auto grid gap-8">
        {blogs.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="p-6 rounded-xl bg-white shadow hover:shadow-lg transition block"
          >
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-2">{post.description}</p>
            <span className="text-sm text-gray-400">{post.date}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

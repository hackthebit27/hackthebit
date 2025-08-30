// app/blog/category/[cat]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

interface Props {
  params: { cat: string };
}

const ICONS: Record<string, string> = {
  "c++": "⚡",
  python: "🐍",
  "system-design": "🏗️",
  "dsa": "🧩",
  "design-patterns": "🎨",
};

export default async function CategoryPage({ params }: Props) {
  const posts = await getAllPosts();
  const category = decodeURIComponent(params.cat);
  const filtered = posts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  if (filtered.length === 0) return notFound();

  const icon = ICONS[category.toLowerCase()] || "📚";
  const prettyName =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-6">
      {/* Category Hero */}
      <section className="max-w-5xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-50 text-indigo-700 text-lg font-semibold">
          <span className="text-2xl">{icon}</span>
          {prettyName} Guides & Tutorials
        </div>
        <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Master <span className="text-indigo-700">{prettyName}</span> with Practical Blogs
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Curated deep-dives, hands-on guides, and quick references to level up your{" "}
          {prettyName} skills 🚀
        </p>
        <div className="w-24 h-1 bg-indigo-600 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* Blog List */}
      <section className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-indigo-400 transition transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(post.date).toDateString()}
            </p>
            <p className="text-gray-700 mt-3 line-clamp-3">
              {post.description}
            </p>
            <span className="inline-block mt-4 text-indigo-700 font-semibold group-hover:underline">
              Read more →
            </span>
          </Link>
        ))}
      </section>

      {/* Back to categories */}
      <div className="text-center mt-16">
        <Link
          href="/blog"
          className="inline-block text-indigo-700 hover:text-indigo-900 underline underline-offset-4 font-medium"
        >
          ← Back to Categories
        </Link>
      </div>
    </main>
  );
}
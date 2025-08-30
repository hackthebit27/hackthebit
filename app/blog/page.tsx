// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog Categories",
  description:
    "Explore curated blogs on C++, Python, DSA, System Design, and Design Patterns. Learn faster with practical guides.",
  alternates: { canonical: "/blog" },
};

const CATEGORIES = [
  {
    slug: "c++",
    icon: "⚡",
    title: "C++",
    desc: "Best practices, modern C++ concepts, and coding wisdom.",
  },
  {
    slug: "python",
    icon: "🐍",
    title: "Python",
    desc: "Beginner-friendly to advanced Python tutorials.",
  },
  {
    slug: "dsa",
    icon: "🧩",
    title: "DSA & Algorithms",
    desc: "Ace interviews with problem-solving techniques.",
  },
  {
    slug: "system-design",
    icon: "🏗️",
    title: "System Design",
    desc: "HLD & LLD explained with real-world examples.",
  },
  {
    slug: "design-patterns",
    icon: "🎨",
    title: "Design Patterns",
    desc: "Reusable solutions for common coding problems.",
  },
];

export default function BlogCategoriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-6">
      {/* Hero */}
      <header className="max-w-4xl mx-auto text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          📚 Explore Blog Categories
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Pick a topic to dive into curated tutorials, deep-dives, and practical guides 🚀
        </p>
        <div className="w-24 h-1 bg-indigo-600 mx-auto mt-6 rounded-full"></div>
      </header>

      {/* Categories Grid */}
      <section className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/blog/category/${cat.slug}`}
            className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg hover:border-indigo-400 transition transform hover:-translate-y-1 text-center"
          >
            <div className="text-4xl mb-3">{cat.icon}</div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700">
              {cat.title}
            </h2>
            <p className="text-gray-600 mt-2">{cat.desc}</p>
            <span className="inline-block mt-4 text-indigo-700 font-semibold group-hover:underline">
              Explore →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
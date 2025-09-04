// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
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
    desc: "Ace interviews with proven problem-solving patterns.",
  },
  {
    slug: "system-design",
    icon: "🏗️",
    title: "System Design",
    desc: "HLD & LLD explained with practical, real-world examples.",
  },
  {
    slug: "design-patterns",
    icon: "🎨",
    title: "Design Patterns",
    desc: "Reusable solutions for common engineering problems.",
  },
];

export default function BlogCategoriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
          📚 Explore Blog Categories
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Pick a topic to dive into curated tutorials, deep-dives, and practical guides.
        </p>
        <div className="w-24 h-1 bg-indigo-600 mx-auto mt-6 rounded-full" />
      </header>

      {/* Horizontal Scroll Row */}
      <section
        className="max-w-6xl mx-auto px-6 pb-16 overflow-x-auto"
        aria-label="Blog categories"
      >
        {/* subtle shadow mask on edges for nicer overflow look */}
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent" />

          <div className="flex gap-6 min-w-max pr-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${encodeURIComponent(cat.slug)}`}
                className="min-w-[280px] max-w-[320px] flex-shrink-0 group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition"
              >
                <div className="text-3xl">{cat.icon}</div>
                <h2 className="mt-3 text-xl font-bold text-neutral-900 group-hover:text-indigo-700">
                  {cat.title}
                </h2>
                <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
                  {cat.desc}
                </p>
                <span className="mt-4 inline-block text-indigo-700 font-medium group-hover:underline">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* scroll hint for mobile */}
        <p className="mt-3 text-center text-xs text-neutral-500 md:hidden">
          ← Swipe to see more →
        </p>
      </section>

      {/* Optional: quick access grid (kept minimal & scalable) */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Or jump straight in:
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${encodeURIComponent(cat.slug)}`}
              className="px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm text-neutral-800 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition"
            >
              {cat.icon} {cat.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
// lib/categories.ts
export const CATEGORY_INFO: Record<
  string,
  { icon: string; title: string; desc: string; gradient: string }
> = {
  "c++": {
    icon: "⚡",
    title: "C++ Blogs",
    desc: "Deep dives into modern C++ best practices, STL, memory management, and interview prep.",
    gradient: "from-indigo-600 via-purple-600 to-indigo-700",
  },
  python: {
    icon: "🐍",
    title: "Python Blogs",
    desc: "Learn Python with practical scripts, automation tips, and project-based guides.",
    gradient: "from-green-500 via-emerald-500 to-green-600",
  },
  "system-design": {
    icon: "🏗️",
    title: "System Design Blogs",
    desc: "High-level and low-level design explained with diagrams, tradeoffs, and real-world examples.",
    gradient: "from-slate-700 via-gray-700 to-slate-800",
  },
  dsa: {
    icon: "🧩",
    title: "DSA & Algorithms Blogs",
    desc: "Step-by-step guides for solving data structures & algorithms problems efficiently.",
    gradient: "from-pink-500 via-rose-500 to-red-600",
  },
};
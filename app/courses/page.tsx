// app/courses/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { addEnrollment, getEnrollments, getUser } from "@/lib/localUser";
import { useRouter } from "next/navigation";
import { Search, GraduationCap, Layers, Sparkles } from "lucide-react";

const COURSES = [
  { id: "python-foundations", title: "Python Foundations", level: "Beginner" as const, desc: "Start your journey with Python basics and projects." },
  { id: "web-dev-101", title: "Web Development 101", level: "Intermediate" as const, desc: "HTML, CSS, JS — ship your first interactive website." },
  { id: "dsa-accelerator", title: "Data Structures & Algorithms", level: "Advanced" as const, desc: "Sharpen problem solving, ace coding interviews." },
  { id: "system-design-lite", title: "System Design Lite", level: "Intermediate" as const, desc: "Concepts, trade-offs, and simple case studies." },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;
type LevelFilter = (typeof LEVELS)[number];

export default function CoursesPage() {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<LevelFilter>("All");

  useEffect(() => {
    setHasProfile(!!getUser());
    setEnrolledIds(getEnrollments().map((e) => e.id));
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return COURSES.filter((c) => {
      const levelOk = level === "All" || c.level === level;
      const qOk =
        !term ||
        c.title.toLowerCase().includes(term) ||
        c.desc.toLowerCase().includes(term);
      return levelOk && qOk;
    });
  }, [q, level]);

  const handleEnroll = (id: string, title: string, level: "Beginner" | "Intermediate" | "Advanced") => {
    if (!hasProfile) {
      router.push("/join");
      return;
    }
    addEnrollment({ id, title, level, enrolledAt: new Date().toISOString() });
    setEnrolledIds((prev) => Array.from(new Set([id, ...prev])));
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-indigo-600" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Explore Courses
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          Curated tracks to help you learn faster. Enroll with one click.
        </p>

        {/* Filters */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative md:w-80">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses…"
              className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {LEVELS.map((lv) => {
              const active = level === lv;
              return (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition ${
                    active
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  {lv}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtered.map((c) => {
            const isEnrolled = enrolledIds.includes(c.id);
            return (
              <div
                key={c.id}
                className="group p-6 rounded-2xl bg-white shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow transition"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    <Layers size={14} /> {c.level}
                  </span>
                  <Sparkles size={16} className="text-indigo-300 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">{c.title}</h3>
                <p className="mt-2 text-gray-600">{c.desc}</p>

                <button
                  onClick={() => handleEnroll(c.id, c.title, c.level)}
                  disabled={isEnrolled}
                  className={`mt-5 w-full rounded-xl py-2.5 font-semibold transition ${
                    isEnrolled
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isEnrolled ? "Already Enrolled" : "Enroll"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
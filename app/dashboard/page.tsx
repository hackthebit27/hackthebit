"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  PlayCircle,
  Award,
  Clock,
  Layers,
  Calendar,
  Star,
  ChevronRight,
} from "lucide-react";

/* ----------------------------- Mocked Data ----------------------------- */
// Later, replace this with real data from your DB/API.
const ENROLLED = [
  {
    id: "py-beginner",
    title: "Python Foundations",
    level: "Beginner",
    progress: 62,
    lessonsCompleted: 16,
    totalLessons: 26,
    nextLessonAt: "Today, 6:30 PM",
    mentor: "Ayesha K",
    accent: "from-indigo-500 to-purple-600",
  },
  {
    id: "web-dev",
    title: "Modern Web Development",
    level: "Intermediate",
    progress: 35,
    lessonsCompleted: 7,
    totalLessons: 20,
    nextLessonAt: "Wed, 5:00 PM",
    mentor: "Liam C",
    accent: "from-pink-500 to-rose-500",
  },
  {
    id: "dsa-101",
    title: "Data Structures & Algorithms",
    level: "Advanced",
    progress: 12,
    lessonsCompleted: 3,
    totalLessons: 25,
    nextLessonAt: "Fri, 7:15 PM",
    mentor: "Ravi S",
    accent: "from-emerald-500 to-teal-500",
  },
];

const RECOMMENDED = [
  {
    id: "sys-design",
    title: "System Design Crash Course",
    badges: ["Interview", "Scalable Systems"],
  },
  {
    id: "ts-pro",
    title: "TypeScript for Pros",
    badges: ["Types", "Tooling"],
  },
];

/* --------------------------- Small UI Helpers -------------------------- */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-700">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function CourseCard({
  course,
}: {
  course: (typeof ENROLLED)[number];
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
          <p className="mt-1 text-xs font-medium text-gray-500">{course.level}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full bg-gradient-to-r ${course.accent} px-3 py-1 text-xs font-semibold text-white shadow-sm`}
        >
          <PlayCircle size={14} className="mr-1.5" />
          Continue
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <ProgressBar value={course.progress} />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {course.lessonsCompleted}/{course.totalLessons} lessons
          </span>
          <span>{course.progress}%</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
          <Calendar size={14} className="text-indigo-600" />
          Next: {course.nextLessonAt}
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
          <BookOpen size={14} className="text-indigo-600" />
          Mentor: {course.mentor}
        </div>
      </div>
    </motion.div>
  );
}

/* --------------------------------- Page -------------------------------- */
export default function DashboardPage() {
  const totals = useMemo(() => {
    const totalCourses = ENROLLED.length;
    const avg =
      Math.round(
        (ENROLLED.reduce((a, c) => a + c.progress, 0) / Math.max(totalCourses, 1)) * 10
      ) / 10;
    const completedLessons = ENROLLED.reduce((a, c) => a + c.lessonsCompleted, 0);
    return { totalCourses, avg, completedLessons };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50/40">
      {/* Top bar (local to dashboard) */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Your Dashboard
          </h1>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="hidden sm:inline">HackTheBit</span>
            <ChevronRight size={14} />
            <span className="font-semibold text-gray-900">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-8">
          {/* Greeting + Stats */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-gray-500">Welcome back 👋</p>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Keep building, keep shipping!
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <StatChip icon={Layers} label="Enrolled" value={totals.totalCourses} />
                <StatChip icon={Clock} label="Avg Progress" value={`${totals.avg}%`} />
                <StatChip icon={Award} label="Lessons Done" value={totals.completedLessons} />
              </div>
            </div>
          </section>

          {/* Enrolled Programs */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Programs</h3>
              <button className="text-sm font-semibold text-indigo-700 hover:text-indigo-800">
                View All
              </button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {ENROLLED.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>

          {/* Recommended */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recommended for you
              </h3>
              <button className="text-sm font-semibold text-indigo-700 hover:text-indigo-800">
                See more
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {RECOMMENDED.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{r.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {r.badges.map((b) => (
                        <span
                          key={b}
                          className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Star className="mt-1 text-indigo-600" size={18} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Next session */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              <h4 className="text-sm font-semibold text-gray-900">Upcoming</h4>
            </div>
            <div className="space-y-4">
              {ENROLLED.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    With {c.mentor} • {c.nextLessonAt}
                  </p>
                  <div className="mt-3">
                    <ProgressBar value={c.progress} />
                    <p className="mt-1 text-[11px] text-gray-500">
                      {c.progress}% complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Award size={18} className="text-indigo-600" />
              <h4 className="text-sm font-semibold text-gray-900">Achievements</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-700">7-day streak</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  New
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-700">First 10 lessons</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                  +100 XP
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-700">Shared a project</span>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  Pro
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
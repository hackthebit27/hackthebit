// app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getUser,
  getEnrollments,
  clearUser,
  type Enrollment,
  type UserProfile,
} from "@/lib/localUser";
import Link from "next/link";
import { BadgeCheck, LogOut, BookOpenCheck, UserCircle2 } from "lucide-react";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    setUser(getUser());
    setEnrollments(getEnrollments());
  }, []);

  const stats = useMemo(
    () => ({
      total: enrollments.length,
      byLevel: enrollments.reduce(
        (acc, e) => ({ ...acc, [e.level]: (acc[e.level] || 0) + 1 }),
        {} as Record<string, number>
      ),
    }),
    [enrollments]
  );

  if (!user) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">No profile found</h1>
          <p className="text-gray-600 mb-6">Create your free profile to enroll in programs.</p>
          <Link
            href="/join"
            className="inline-block rounded-xl bg-indigo-600 text-white px-5 py-2.5 font-semibold hover:bg-indigo-700"
          >
            Join Free
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Profile card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-100 text-indigo-700 grid place-items-center text-xl font-bold">
                {initials(user.name) || <UserCircle2 />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900">{user.name}</h1>
                  <BadgeCheck className="text-indigo-600" size={18} />
                </div>
                <p className="text-gray-600">{user.email}</p>
                {user.interests.length > 0 && (
                  <p className="text-gray-600 text-sm mt-1">
                    Interests: <span className="text-gray-800">{user.interests.join(", ")}</span>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                clearUser();
                window.location.href = "/join";
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Beginner</p>
              <p className="text-xl font-semibold text-gray-900">{stats.byLevel["Beginner"] || 0}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Intermediate/Advanced</p>
              <p className="text-xl font-semibold text-gray-900">
                {(stats.byLevel["Intermediate"] || 0) + (stats.byLevel["Advanced"] || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Enrollments */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpenCheck className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Enrolled Programs</h2>
          </div>

          {enrollments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-10 bg-white text-center">
              <p className="text-gray-700 mb-4">
                You haven’t enrolled in any program yet.
              </p>
              <Link
                href="/courses"
                className="inline-block rounded-xl bg-indigo-600 text-white px-5 py-2.5 font-semibold hover:bg-indigo-700"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((e) => (
                <div key={e.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {e.level}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-1">{e.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}
                  </p>
                  {/* Placeholder progress */}
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: "12%" }} />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Progress: 12%</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
// app/join/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUser, type UserProfile } from "@/lib/localUser";
import { CheckCircle2, Mail, User2, ChevronRight, Sparkles } from "lucide-react";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const interestOptions = ["Python", "Web Dev", "DSA", "System Design", "AI/ML"];

  const toggleInterest = (val: string) =>
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      return setError("Please enter a valid email.");
    if (!agree) return setError("Please accept the updates notice.");
    setSaving(true);

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      interests,
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Value prop */}
        <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-3xl p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
            <Sparkles size={16} /> Join Free — 2 mins
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-4">
            Welcome to <span className="text-black">Hack</span>
            <span className="text-indigo-600">The</span>
            <span className="text-black">Bit</span>
          </h1>
          <p className="text-gray-600 mt-3">
            Create your learner profile to enroll in programs, track progress, and
            learn with a friendly community.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Access beginner → advanced tracks",
              "One-click enroll & progress tracking",
              "Project-based learning & mentorship",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-emerald-600" size={20} />
                <span className="text-gray-800">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-sm text-gray-500">
            By joining, you agree to receive product updates. You can unsubscribe
            anytime.
          </div>
        </div>

        {/* Right: Form */}
        <form
          onSubmit={onSubmit}
          className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((opt) => {
                const active = interests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`px-3 py-1.5 rounded-full border text-sm transition ${
                      active
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I agree to receive updates about new programs.
          </label>

          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full group rounded-xl bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? "Creating your profile..." : "Create profile"}
            <ChevronRight
              className="transition-transform group-hover:translate-x-0.5"
              size={18}
            />
          </button>

          <p className="text-xs text-gray-500 text-center">
            Already joined?{" "}
            <a className="underline underline-offset-2" href="/dashboard">
              Go to Dashboard
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}
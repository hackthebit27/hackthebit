"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Linkedin,
  Users,
  BookOpen,
  Trophy,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="bg-gradient-to-b from-yellow-50 to-orange-100 min-h-screen font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-md shadow-md z-50">
        <div className="flex items-center space-x-3">
          <img
            src="/logo/hackthebit-logo-primary.svg"
            alt="HackTheBit"
            className="h-10 md:h-14 w-auto"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
          {["Courses", "Mentors", "Community", "About", "Blog"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="relative group"
            >
              <span className="hover:text-purple-700 transition">{item}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-600 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 hover:shadow-lg transition">
            Join Free
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md text-purple-700 hover:bg-purple-100 transition"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white shadow-md px-6 py-4 space-y-4"
        >
          {["Courses", "Mentors", "Community", "About", "Blog"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="block font-medium text-gray-700 hover:text-purple-700"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </Link>
          ))}
          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 hover:shadow-lg transition">
            Join Free
          </button>
        </motion.div>
      )}

      

      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/30 via-purple-700/20 to-pink-600/20 animate-pulse" />

        {/* Floating doodles */}
        <motion.img
          src="/doodles/star.png"
          alt="star doodle"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 left-6 w-20 md:w-28 opacity-80"
        />
        <motion.img
          src="/doodles/arrow.png"
          alt="arrow doodle"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-24 md:w-32 opacity-80"
        />

        <motion.h1
          className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Coding for Everyone – From Kids to Professionals
        </motion.h1>

        <motion.p
          className="mb-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-200"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Learn coding in your own language, your own way – with real mentors,
          peers, and a playful learning experience.
        </motion.p>

        <motion.div
          className="space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-green-400/40 transition">
            Start Learning Free
          </button>
          <button className="bg-white hover:bg-gray-200 text-purple-700 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-purple-400/40 transition">
            Explore Courses
          </button>
        </motion.div>

        {/* Playground */}
        <div className="mt-14 max-w-lg mx-auto bg-gray-900 text-left p-6 rounded-2xl shadow-2xl text-gray-100 font-mono text-sm relative overflow-hidden border border-gray-700">
          {/* Terminal header */}
          <div className="flex items-center mb-4 space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <p className="ml-3 text-xs text-gray-400">HackTheBit Playground</p>
          </div>
          <textarea
            id="playground-input"
            rows={3}
            defaultValue={`print("Hello World")`}
            className="w-full bg-gray-800 text-gray-100 rounded-lg p-3 mb-3 focus:outline-none resize-none font-mono"
          />
          <button
            onClick={() => {
              const input = (document.getElementById("playground-input") as HTMLTextAreaElement).value.trim();
              let output = "";
              try {
                if (input.startsWith("print(")) {
                  output = input.replace(/^print\((.*)\)$/, "$1");
                } else {
                  // eslint-disable-next-line no-eval
                  output = eval(input).toString();
                }
              } catch {
                output = "⚠️ Invalid command";
              }
              const outDiv = document.getElementById("playground-output") as HTMLDivElement;
              outDiv.innerText = output + " █"; // blinking cursor effect
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-semibold shadow-md"
          >
            Run ▶
          </button>
          <div
            id="playground-output"
            className="mt-4 bg-black text-green-400 p-3 rounded-lg min-h-[40px] whitespace-pre-wrap"
          ></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-indigo-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
       <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-16">
  Why{" "}
  <span className="text-black">Hack</span>
  <span className="text-indigo-600">The</span>
  <span className="text-black">Bit</span>?
</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-10 h-10 text-indigo-600" />,
                title: "🚀 Lightning Fast",
                desc: "Run code instantly with zero setup. Type. Run. Learn.",
              },
              {
                icon: <BookOpen className="w-10 h-10 text-emerald-600" />,
                title: "🔒 Safe & Secure",
                desc: "Sandbox environment ensures your code is always protected.",
              },
              {
                icon: <Trophy className="w-10 h-10 text-pink-500" />,
                title: "🌍 Learn Together",
                desc: "Join a thriving global community of coders & creators.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="p-8 bg-white shadow-xl rounded-2xl hover:shadow-2xl transition border border-gray-100"
              >
                {f.icon}
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section
        id="courses"
        className="py-20 px-6 bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 text-white text-center relative overflow-hidden"
      >
        <h2 className="text-4xl font-extrabold mb-12 tracking-wide">
          🚀 Explore Our Courses
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto relative z-10">
          {[
            { icon: "🐍", title: "Beginner Python", desc: "Start your journey with Python basics and fun projects." },
            { icon: "🌐", title: "Web Development", desc: "HTML, CSS, JS — build your first interactive website." },
            { icon: "🧩", title: "Data Structures", desc: "Master coding interviews & sharpen your problem-solving." },
          ].map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -8 }}
              className="p-6 rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 transition"
            >
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <span className="text-2xl">{c.icon}</span> {c.title}
              </h3>
              <p className="text-gray-200">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black py-8 px-6 text-center text-gray-400 relative">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
          <p className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} HackTheBit · Made with ❤️
          </p>
          <div className="flex space-x-4">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="hover:text-white transition">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <a
          href="#top"
          className="absolute right-6 bottom-6 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs transition"
        >
          ↑ Back to Top
        </a>
      </footer>
    </main>
  );
}

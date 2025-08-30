"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV = ["Courses", "Mentors", "Community", "About", "Blog"];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex justify-between items-center px-6 py-4 shadow-md transition-colors duration-300 ${
          scrolled
            ? "bg-white/70 backdrop-blur-md"
            : "bg-white" // ✅ solid white before scroll
        }`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo/hackthebit-logo-primary.svg"
            alt="HackTheBit"
            width={160}
            height={56}
            className="h-10 md:h-14 w-auto"
            priority
          />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
          {NAV.map((label) => {
            const href = `/${label.toLowerCase()}`;
            return (
              <Link key={label} href={href} className="relative group">
                <span
                  className={`hover:text-purple-700 transition ${
                    isActive(href) ? "text-purple-800" : ""
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-purple-600 transition-all ${
                    isActive(href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/join"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 hover:shadow-lg transition"
          >
            Join Free
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md text-purple-700 hover:bg-purple-100 transition"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          {NAV.map((label) => {
            const href = `/${label.toLowerCase()}`;
            return (
              <Link
                key={label}
                href={href}
                className={`block font-medium ${
                  isActive(href)
                    ? "text-purple-800"
                    : "text-gray-700 hover:text-purple-700"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/join"
            onClick={() => setOpen(false)}
            className="w-full text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition inline-block"
          >
            Join Free
          </Link>
        </div>
      )}
    </>
  );
}
// components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Youtube, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo/hackthebit-logo-primary.svg"
              alt="HackTheBit"
              width={140}
              height={48}
              className="w-auto h-10"
            />
          </Link>
          <p className="mt-3 text-sm text-gray-400">
            Learn. Code. Grow. — practical coding guides, courses, and a thriving community.
          </p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
              <li><Link href="/mentors" className="hover:text-white">Mentors</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/community" className="hover:text-white">Community</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/join" className="hover:text-white">Join Free</Link></li>
            </ul>
          </div>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-white font-semibold mb-3">Follow us</h4>
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/HackTheBitX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
              aria-label="X (Twitter)"
              title="X (Twitter)"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/hackthebit/#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Instagram"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/hackthebit/about/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/@HacktheBit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
              aria-label="YouTube"
              title="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            © {new Date().getFullYear()} HackTheBit · Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
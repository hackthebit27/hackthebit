// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";  // ⬅️ import your header
import Footer from "@/components/Footer"; // ⬅️ add this

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.hackthebit.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HackTheBit — Learn. Code. Grow.",
    template: "%s | HackTheBit",
  },
  description:
    "HackTheBit is a playful, community-driven place to learn coding with real mentors, interactive playgrounds, and curated courses.",
  applicationName: "HackTheBit",
  keywords: [
    "coding",
    "python",
    "web development",
    "dsa",
    "learn to code",
    "hackthebit",
    "next.js",
  ],
  icons: {
    icon: "/logo/hackthebit-logo-primary.svg",
  },
  openGraph: {
    type: "website",
    siteName: "HackTheBit",
    url: SITE_URL,
    title: "HackTheBit — Learn. Code. Grow.",
    description:
      "Playful, community-driven coding with mentors, playgrounds, and curated courses.",
    images: [{ url: "/logo/hackthebit-logo-primary.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hackthebit",
    creator: "@hackthebit",
    title: "HackTheBit — Learn. Code. Grow.",
    description:
      "Playful, community-driven coding with mentors, playgrounds, and curated courses.",
    images: ["/logo/hackthebit-logo-primary.svg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <SiteHeader /> {/* ✅ Now header shows on every page */}
        {children}
        <Footer /> {/* ⬅️ add this */}
      </body>
    </html>
  );
}
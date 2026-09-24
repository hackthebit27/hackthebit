// app/sql-console/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL + PL/SQL Mastery Console",
  robots: { index: false, follow: false },
};

export default function SqlConsolePage() {
  return (
    <main className="bg-[#0b1420]">
      <iframe
        src="/sql-console/app"
        title="SQL + PL/SQL Mastery Console"
        className="block w-full h-[calc(100vh-72px)] md:h-[calc(100vh-88px)] border-0"
      />
    </main>
  );
}

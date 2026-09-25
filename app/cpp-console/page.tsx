// app/cpp-console/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "C++ Mastery Console",
  robots: { index: false, follow: false },
};

export default function CppConsolePage() {
  return (
    <main className="bg-[#0b1420]">
      <iframe
        src="/cpp-console/app"
        title="C++ Mastery Console"
        className="block w-full h-[calc(100vh-72px)] md:h-[calc(100vh-88px)] border-0"
      />
    </main>
  );
}

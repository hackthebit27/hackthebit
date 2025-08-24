// components/CopyLinkButton.tsx
"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op
    }
  };

  return (
    <button
      onClick={copy}
      className="text-xs bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-700 px-3 py-1 rounded-lg transition"
      aria-label="Copy link"
    >
      {copied ? "Copied ✓" : "Copy link"}
    </button>
  );
}
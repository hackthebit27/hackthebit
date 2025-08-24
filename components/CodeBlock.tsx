"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/70">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-3 uppercase tracking-wider text-gray-400">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={onCopy}
          className="text-xs rounded-md px-2 py-1 bg-gray-800 text-gray-200 hover:bg-gray-700 transition"
          aria-label="Copy code"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Code body */}
      <pre className="overflow-x-auto p-4 text-gray-100 text-sm leading-7">
        <code>{code}</code>
      </pre>
    </div>
  );
}
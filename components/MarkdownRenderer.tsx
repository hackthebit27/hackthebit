/* eslint-disable @next/next/no-img-element */
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ImgHTMLAttributes } from "react";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => (
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4" {...props} />
        ),
        h2: (props) => (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3" {...props} />
        ),
        h3: (props) => (
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mt-8 mb-2" {...props} />
        ),
        p: (props) => (
          <p className="text-base md:text-lg leading-8 text-gray-900 mb-5" {...props} />
        ),
        a: (props) => (
          <a
            className="text-indigo-700 underline underline-offset-2 hover:text-indigo-800"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        ul: (props) => <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-900" {...props} />,
        ol: (props) => <ol className="list-decimal pl-6 space-y-2 mb-5 text-gray-900" {...props} />,
        li: (props) => <li className="marker:text-gray-600" {...props} />,
        blockquote: (props) => (
          <blockquote
            className="border-l-4 border-indigo-300 bg-indigo-50/70 text-gray-900 px-4 py-3 rounded-r-lg italic my-6"
            {...props}
          />
        ),
        hr: () => <hr className="my-10 border-t border-gray-200" />,

        // Block code
        pre: (props) => (
          <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 md:p-5 overflow-x-auto my-6 shadow-md" {...props} />
        ),

        // Inline code
        code: (props) => (
          <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 font-mono text-sm" {...props} />
        ),

        table: (props) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-gray-200 text-left text-gray-900" {...props} />
          </div>
        ),
        thead: (props) => <thead className="bg-gray-50 text-gray-900 font-semibold" {...props} />,
        th: (props) => <th className="border-b border-gray-200 px-3 py-2" {...props} />,
        td: (props) => <td className="border-b border-gray-100 px-3 py-2" {...props} />,

        // Properly typed <img> renderer (using native <img> inside markdown)
        img: (props) => {
          const p = props as ImgHTMLAttributes<HTMLImageElement>;
          return (
            <img
              {...p}
              alt={typeof p.alt === "string" ? p.alt : ""}
              className={`rounded-lg shadow-sm my-6 max-w-full h-auto ${p.className ?? ""}`}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
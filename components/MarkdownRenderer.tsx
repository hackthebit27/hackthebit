"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mt-8 mb-2" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="text-base md:text-lg leading-8 text-gray-900 mb-5" {...props} />
        ),
        strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
        em: ({ node, ...props }) => <em className="text-gray-900" {...props} />,
        a: ({ node, ...props }) => (
          <a
            className="text-indigo-700 underline underline-offset-2 hover:text-indigo-800"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-900" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 mb-5 text-gray-900" {...props} />,
        li: ({ node, ...props }) => <li className="marker:text-gray-600" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-indigo-300 bg-indigo-50/70 text-gray-900 px-4 py-3 rounded-r-lg italic my-6"
            {...props}
          />
        ),
        hr: () => <hr className="my-10 border-t border-gray-200" />,
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 font-mono text-sm" {...props} />
          ) : (
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 md:p-5 overflow-x-auto my-6 shadow-md">
              <code {...props} />
            </pre>
          ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-gray-200 text-left text-gray-900" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gray-50 text-gray-900 font-semibold" {...props} />
        ),
        th: ({ node, ...props }) => <th className="border-b border-gray-200 px-3 py-2" {...props} />,
        td: ({ node, ...props }) => <td className="border-b border-gray-100 px-3 py-2" {...props} />,
        img: ({ node, ...props }) => (
          <img className="rounded-lg shadow-sm my-6 max-w-full h-auto" {...(props as any)} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

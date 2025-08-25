/* eslint-disable @next/next/no-img-element */
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  ImgHTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";
import { isValidElement } from "react";
import CodeBlock from "./CodeBlock";

// Safely extract text from a ReactNode (for heading slug links)
const textFrom = (node: ReactNode): string => {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFrom).join("");

  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return textFrom(el.props?.children);
  }
  return "";
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const H = ({
  as: Tag,
  className,
  children,
}: PropsWithChildren<{ as: "h1" | "h2" | "h3"; className: string }>) => {
  const id = slugify(textFrom(children));
  return (
    <Tag id={id} className={className}>
      <a href={`#${id}`} className="no-underline hover:underline">
        {children}
      </a>
    </Tag>
  );
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <H as="h1" className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            {children}
          </H>
        ),
        h2: ({ children }) => (
          <H as="h2" className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
            {children}
          </H>
        ),
        h3: ({ children }) => (
          <H as="h3" className="text-xl md:text-2xl font-semibold text-gray-900 mt-8 mb-2">
            {children}
          </H>
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

        // Code blocks & inline code
        code({ className, children, ...props }) {
          const isBlock = /\n/.test(String(children ?? ""));
          if (isBlock) {
            const m = /language-(\w+)/.exec(className ?? "");
            const language = m?.[1] ?? "";
            const code = String(children ?? "");
            return <CodeBlock code={code} language={language} />;
          }
          return (
            <code
              className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 font-mono text-sm"
              {...props}
            />
          );
        },

        table: (props) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-gray-200 text-left text-gray-900" {...props} />
          </div>
        ),
        thead: (props) => <thead className="bg-gray-50 text-gray-900 font-semibold" {...props} />,
        th: (props) => <th className="border-b border-gray-200 px-3 py-2" {...props} />,
        td: (props) => <td className="border-b border-gray-100 px-3 py-2" {...props} />,
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
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { ReactNode, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ImgHTMLAttributes } from "react";
import CodeBlock from "./CodeBlock";

const textFrom = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFrom).join("");
  if (isValidElement<{ children?: ReactNode }>(node) && node.props?.children) {
    return textFrom(node.props.children);
  }
  return "";
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

function Heading({
  as: Tag,
  children,
  className,
}: {
  as: "h1" | "h2" | "h3";
  children: ReactNode;
  className: string;
}) {
  const txt = textFrom(children);
  const id = slugify(txt);
  return (
    <Tag id={id} className={className}>
      <a href={`#${id}`} className="no-underline hover:underline">
        {children}
      </a>
    </Tag>
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{

        // inside MarkdownRenderer
h1: ({ children }) => (
  <Heading as="h1" className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
    {children}
  </Heading>
),
h2: ({ children }) => (
  <Heading as="h2" className="text-xl md:text-2xl font-semibold text-gray-900 mt-6 mb-3">
    {children}
  </Heading>
),
h3: ({ children }) => (
  <Heading as="h3" className="text-lg md:text-xl font-medium text-gray-900 mt-4 mb-2">
    {children}
  </Heading>
),
       
        p: (props) => <p className="text-base md:text-lg leading-8 text-gray-900 mb-5" {...props} />,
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
        li: (props) => <li className="text-black marker:text-gray-600 leading-relaxed" {...props} />,
        blockquote: (props) => (
          <blockquote
            className="border-l-4 border-indigo-300 bg-indigo-50/70 text-gray-900 px-4 py-3 rounded-r-lg italic my-6"
            {...props}
          />
        ),
        code({ className, children, ...props }) {
          const isBlock = /\n/.test(String(children || ""));
          if (isBlock) {
            const m = /language-(\w+)/.exec(className || "");
            const language = m?.[1] || "";
            return <CodeBlock code={String(children)} language={language} />;
          }
          return (
            <code
              className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 font-mono text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
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
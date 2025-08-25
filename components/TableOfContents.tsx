// components/TableOfContents.tsx
"use client";

import type { FC } from "react";

type TOCItem = { level: number; text: string; id: string };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Extracts markdown H2/H3 headings and returns a list with ids that match
 * the ids your MarkdownRenderer assigns (it uses the same slugify()).
 */
function extractHeadings(md: string): TOCItem[] {
  const lines = md.split("\n");
  const items: TOCItem[] = [];

  for (const line of lines) {
    // Match "## Heading" or "### Heading" (skip H1 for TOC)
    const h2 = line.match(/^##\s+(.*)$/);
    const h3 = line.match(/^###\s+(.*)$/);

    if (h2) {
      const text = h2[1].trim();
      items.push({ level: 2, text, id: slugify(text) });
    } else if (h3) {
      const text = h3[1].trim();
      items.push({ level: 3, text, id: slugify(text) });
    }
  }

  return items;
}

const TableOfContents: FC<{ content: string }> = ({ content }) => {
  const items = extractHeadings(content);

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No sections found.
      </p>
    );
  }

  return (
    <nav aria-label="Table of contents">
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={`${item.id}-${i}`} className={item.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${item.id}`}
              className="block text-sm text-gray-700 hover:text-indigo-700 hover:underline underline-offset-2"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
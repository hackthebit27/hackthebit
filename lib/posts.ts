import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import type { BlogMeta, BlogPost } from "@/types/blog";

const POSTS_DIR = path.join(process.cwd(), "data", "posts");

export async function getAllPosts(): Promise<BlogMeta[]> {
  const files = await fs.readdir(POSTS_DIR);
  const posts: BlogMeta[] = [];
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const slug = file.replace(/\.md$/, "");
    const full = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(full, "utf8");
    const { data } = matter(raw);
    if (!data?.title || !data?.date) continue; // require basics
    posts.push({
      slug,
      title: String(data.title),
      date: String(data.date),
      description: data.description ? String(data.description) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    });
  }
  // newest first
  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const full = path.join(POSTS_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(full, "utf8");
    const { data, content } = matter(raw);
    if (!data?.title || !data?.date) return null;
    return {
      slug,
      title: String(data.title),
      date: String(data.date),
      description: data.description ? String(data.description) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
      content,
    };
  } catch {
    return null;
  }
}
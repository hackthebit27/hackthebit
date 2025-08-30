export interface BlogMeta {
  slug: string;
  title: string;
  date: string; // ISO-like string, e.g. "2025-08-25"
  description?: string;
  tags?: string[];
  category: string;
}

export interface BlogPost extends BlogMeta {
  content: string; // full markdown body
}
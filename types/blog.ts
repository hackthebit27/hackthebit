export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO or pretty string
}

export interface Blog extends BlogMeta {
  content: string; // markdown
}


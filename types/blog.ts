export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export interface Blog extends BlogMeta {
  content: string;
}

interface BlogProps {
  params: Promise<{ slug: string }>; // 👈 params is async
}

const blogContent: Record<string, { title: string; body: string }> = {
  "why-learn-python": {
    title: "Why Learn Python in 2025?",
    body: `
      Python is versatile, beginner-friendly, and widely used in data science,
      AI, web development, and more. Its popularity continues to grow with
      new tools and frameworks making it even more powerful.
    `,
  },
  "webdev-trends-2025": {
    title: "Web Development Trends in 2025",
    body: `
      From AI-assisted coding to frameworks like Next.js and SvelteKit,
      web development is evolving rapidly. Developers must adapt to 
      new tools while keeping fundamentals strong.
    `,
  },
};

export default async function BlogDetail({ params }: BlogProps) {
  const { slug } = await params; // 👈 await params here
  const blog = blogContent[slug];

  if (!blog) {
    return <p className="text-center mt-20">Blog not found.</p>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-6">
      <article className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">{blog.title}</h1>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {blog.body}
        </p>
      </article>
    </main>
  );
}

import { Blog } from "@/types/blog";

export const blogs: Blog[] = [
  {
    slug: "first-post",
    title: "Getting Started with HackTheBit",
    description: "Learn how HackTheBit helps developers grow.",
    date: "2025-08-20",
    content: `
# Getting Started 🚀

HackTheBit is your go-to platform for learning, collaboration, and growth.
    
- Easy to use
- Scalable
- Community-driven
    `,
  },
  {
    slug: "second-post",
    title: "Next.js Tips & Tricks",
    description: "Improve your productivity with these tips.",
    date: "2025-08-21",
    content: `
# Next.js Tips ⚡

Here are some tips for building with Next.js:
    
1. Use \`app/\` router
2. Optimize images with \`next/image\`
3. Deploy easily on Vercel
    `,
  },
];

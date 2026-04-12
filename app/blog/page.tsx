import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on ethical design, dark patterns, and building a more honest web.",
  alternates: {
    canonical: "https://light-patterns.com/blog",
  },
  openGraph: {
    url: "https://light-patterns.com/blog",
    title: "Blog — Light Patterns",
    description:
      "Thoughts on ethical design, dark patterns, and building a more honest web.",
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}

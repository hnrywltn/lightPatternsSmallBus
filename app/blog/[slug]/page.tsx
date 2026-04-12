import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { posts, getPost } from "@/lib/blog";
import BlogArticle from "@/components/BlogArticle";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Light Patterns`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Navbar forceDark />
      <main className="min-h-screen pt-28 pb-24 px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#f2ede4]/40 hover:text-[#f2ede4]/70 transition-colors mb-12"
          >
            <span aria-hidden>←</span> All articles
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2.5 py-1 rounded-full bg-amber-600/15 text-amber-400 border border-amber-600/20"
                >
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#f2ede4] leading-tight">
              {post.title}
            </h1>
            <div className="mt-5 flex items-center gap-3 text-sm text-[#f2ede4]/35">
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.date}</span>
            </div>
          </header>

          {/* Body */}
          <BlogArticle body={post.body} />
        </div>
      </main>
      <Footer />
    </>
  );
}

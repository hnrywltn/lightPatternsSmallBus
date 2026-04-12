"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSignup from "@/components/BlogSignup";
import { posts } from "@/lib/blog";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export default function BlogPageClient() {
  return (
    <>
      <Navbar forceDark />
      <main className="min-h-screen pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-16"
          >
            <p className="text-amber-500 text-sm font-medium tracking-widest uppercase mb-3">
              From the team
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#f2ede4] leading-tight">
              Blog
            </h1>
            <p className="mt-4 text-[#f2ede4]/50 text-lg max-w-xl">
              Thoughts on ethical design, dark patterns, and building a more
              honest web.
            </p>
          </motion.div>

          {/* Articles */}
          <div className="flex flex-col divide-y divide-[#f2ede4]/8">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="py-10 group"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-12">
                    {/* Meta */}
                    <div className="shrink-0 mb-3 sm:mb-0 sm:w-40">
                      <p className="text-[#f2ede4]/30 text-sm">{post.date}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {post.categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-xs px-2 py-0.5 rounded-full bg-amber-600/15 text-amber-400 border border-amber-600/20"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-semibold text-[#f2ede4] group-hover:text-amber-400 transition-colors duration-200 leading-snug">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-[#f2ede4]/50 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <p className="mt-4 text-amber-500 text-sm font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
                        Read article
                        <span aria-hidden>→</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <BlogSignup />
        </div>
      </main>
      <Footer />
    </>
  );
}

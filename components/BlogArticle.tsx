"use client";

import { motion } from "framer-motion";

export default function BlogArticle({ body }: { body: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="prose prose-invert prose-lg max-w-none
        prose-p:text-[#f2ede4]/65 prose-p:leading-relaxed
        prose-headings:text-[#f2ede4]
        prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[#f2ede4]"
    >
      {body.map((chunk, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: chunk }} />
      ))}
    </motion.div>
  );
}

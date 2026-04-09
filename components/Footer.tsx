import { Lightbulb } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0c0a07] border-t border-[#f2ede4]/5 py-10 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
            <Lightbulb className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black text-[#f2ede4] text-sm tracking-tight">
            Light Patterns
          </span>
        </a>

        <p className="text-[#f2ede4]/20 text-sm">
          © {new Date().getFullYear()} Light Patterns. All rights reserved.
        </p>

        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm text-[#f2ede4]/25 hover:text-[#f2ede4]/60 transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

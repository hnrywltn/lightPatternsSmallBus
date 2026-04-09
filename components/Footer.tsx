import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">
            Light Patterns
          </span>
        </a>

        <p className="text-white/25 text-sm">
          © {new Date().getFullYear()} Light Patterns. All rights reserved.
        </p>

        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

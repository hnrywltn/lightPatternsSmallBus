import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0c0a07] border-t border-[#f2ede4]/5 py-10 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href="#" className="flex items-center">
          <Image
            src="/logo-vertical-dark.png"
            alt="Light Patterns"
            width={1056}
            height={1056}
            className="h-10 w-auto"
          />
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

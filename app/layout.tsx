import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Light Patterns — Websites for Small Businesses",
  description:
    "Light Patterns builds beautiful, high-performance websites for small businesses. Launch your site and grow with our subscription model.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0c0a07] text-[#f2ede4]">
        {children}
      </body>
    </html>
  );
}

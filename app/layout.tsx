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
      <body className="min-h-full flex flex-col bg-[#05050a] text-[#f0f0f5]">
        {children}
      </body>
    </html>
  );
}

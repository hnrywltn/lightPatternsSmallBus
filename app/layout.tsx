import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://lightpatternsonline.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Light Patterns — Websites for Small Businesses",
    template: "%s — Light Patterns",
  },
  description:
    "Light Patterns builds beautiful, high-performance websites for small businesses. Launch your site and grow with our subscription model.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Light Patterns",
    title: "Light Patterns — Websites for Small Businesses",
    description:
      "Light Patterns builds beautiful, high-performance websites for small businesses. Launch your site and grow with our subscription model.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Light Patterns — Websites for Small Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Light Patterns — Websites for Small Businesses",
    description:
      "Light Patterns builds beautiful, high-performance websites for small businesses. Launch your site and grow with our subscription model.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Light Patterns",
  url: siteUrl,
  description:
    "Light Patterns builds beautiful, high-performance websites for small businesses with a subscription model for ongoing maintenance.",
  serviceType: "Web Design and Development",
  areaServed: "US",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Website Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Starter",
        description: "A clean, fast website to get your business online.",
      },
      {
        "@type": "Offer",
        name: "Growth",
        description: "More pages, features, and ongoing support.",
      },
      {
        "@type": "Offer",
        name: "Pro",
        description: "Full custom build with priority support.",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#0c0a07] text-[#f2ede4]">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zipway | URL Shortener",
  description: "Enter a long URL to get a shortened link",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4813194510722281"
          crossOrigin="anonymous"
        />
      </Head>

      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

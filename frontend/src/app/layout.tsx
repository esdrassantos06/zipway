import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zipway | URL Shortener",
  description: "Enter a long URL to get a shortened link",
  robots: "index, follow"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body
        className={`${inter.className} antialiased`} suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Head from "next/head";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import CookieConsentBanner from "@/components/CookieConsentBanner";
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
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta
          name="google-adsense-account"
          content={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        />
      </Head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors closeButton />
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { config } from "@/lib/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: config.SITE_NAME,
    template: `%s | ${config.SITE_NAME}`,
  },
  description: config.SITE_DESCRIPTION,
  keywords: ["hentai", "manga", "doujinshi", "gallery", "anime"],
  authors: [{ name: config.SITE_NAME }],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: config.SITE_NAME,
    title: config.SITE_NAME,
    description: config.SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: config.SITE_NAME,
    description: config.SITE_DESCRIPTION,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      H
                    </span>
                  </div>
                  <span className="font-bold text-xl text-foreground">
                    {config.SITE_NAME}
                  </span>
                </Link>

                {/* Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/search"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Search
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <Link
                    href="/search"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Search
                  </Link>
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">{children}</main>

          {/* Footer */}
          <footer className="border-t border-border bg-card">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-muted-foreground text-sm mb-4 md:mb-0">
                  © 2024 {config.SITE_NAME}. All rights reserved.
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <Link
                    href="/search"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Browse
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    18+ Content Warning
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

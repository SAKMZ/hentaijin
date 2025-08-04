import Link from "next/link";
import { config } from "@/lib/config";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* 404 Icon */}
        <div className="text-8xl md:text-9xl font-bold text-muted select-none">
          404
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved,
            deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Back to Home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
          >
            Search Galleries
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Latest Galleries
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/search"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Advanced Search
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/search?category=Manga"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse Manga
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

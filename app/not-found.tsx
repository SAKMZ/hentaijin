import Link from "next/link";
import { config } from "@/lib/config";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* 404 Icon */}
        <div className="text-8xl md:text-9xl font-bold text-gray-500 select-none">
          404
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Page Not Found
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved,
            deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Back to Home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Search Galleries
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Latest Galleries
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/search"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Advanced Search
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/search?category=Manga"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Browse Manga
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

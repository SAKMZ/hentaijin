import Link from "next/link";
import { Metadata } from "next";
import { getTags } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse hentai galleries by tags",
};

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Browse by <span className="text-pink-500">Tags</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Discover galleries organized by content tags
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${encodeURIComponent(tag)}`}
            className="group"
          >
            <span className="inline-flex items-center px-3 py-2 bg-gray-800 hover:bg-pink-600 text-gray-200 hover:text-white rounded-full text-sm transition-all duration-300 group-hover:scale-105">
              #{tag}
            </span>
          </Link>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏷️</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No tags found
          </h3>
          <p className="text-gray-400">
            Tags will appear here once galleries are added to the database.
          </p>
        </div>
      )}
    </div>
  );
}
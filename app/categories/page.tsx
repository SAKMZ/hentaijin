import Link from "next/link";
import { Metadata } from "next";
import { getCategories } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse hentai galleries by category",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Browse by <span className="text-pink-500">Categories</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Discover galleries organized by content categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/category/${encodeURIComponent(category)}`}
            className="group"
          >
            <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-all duration-300 group-hover:scale-105">
              <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                {category}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No categories found
          </h3>
          <p className="text-gray-400">
            Categories will appear here once galleries are added to the database.
          </p>
        </div>
      )}
    </div>
  );
}
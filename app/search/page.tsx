import { Suspense } from "react";
import type { Metadata } from "next";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { SortingControls } from "@/components/ui/SortingControls";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { fetchGalleries } from "@/lib/client-api";
import { config } from "@/lib/config";
import { GalleryListResponse, SearchParams } from "@/types/gallery";

export const metadata: Metadata = {
  title: "Search",
  description: "Search hentai galleries by title, artist, tags, and more",
};

interface SearchPageProps {
  searchParams: {
    search?: string;
    page?: string;
    sort?: string;
  };
}

// Search galleries using API
async function performSearch(
  searchTerm: string,
  page: number = 1,
  sort?: string
): Promise<GalleryListResponse> {
  const params: SearchParams = {
    search: searchTerm,
    page,
    limit: config.GALLERIES_PER_PAGE,
    sort,
  };

  return await fetchGalleries(params);
}

async function SearchResults({
  searchTerm,
  page,
  sort,
}: {
  searchTerm: string;
  page: number;
  sort?: string;
}) {
  const { galleries, pagination } = await performSearch(searchTerm, page, sort);

  if (!galleries || galleries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No galleries found
        </h3>
        <p className="text-gray-400 mb-4">
          Try different search terms or check your spelling
        </p>
        {searchTerm && (
          <div className="text-sm text-gray-500">
            Searched for: "{searchTerm}"
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Search Results</h2>
          <p className="text-gray-400">
            Found {pagination?.totalItems || galleries.length} galleries
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
        {pagination && (
          <div className="text-sm text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        )}
      </div>

      {/* Active Search */}
      {searchTerm && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">Search:</span>
          <span className="inline-flex items-center px-2 py-1 bg-pink-600 text-white rounded text-sm">
            {searchTerm}
          </span>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {galleries.map((gallery) => (
          <GalleryCard key={gallery.hentai_id} gallery={gallery} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination}
          baseUrl="/search"
          searchParams={
            new URLSearchParams({
              ...(searchTerm && { search: searchTerm }),
              page: page.toString(),
              ...(sort && { sort }),
            })
          }
        />
      )}
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const searchTerm = searchParams.search || "";
  const sort = searchParams.sort;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Search <span className="text-pink-500">Galleries</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Find your favorite hentai galleries by title, tags, artists,
          characters, and categories
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-4xl mx-auto">
        <form method="GET" action="/search" className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={searchTerm}
              placeholder="Search galleries, tags, artists, characters, categories..."
              className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
            />
            {/* Preserve sort parameter in search */}
            {sort && <input type="hidden" name="sort" value={sort} />}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors text-sm font-medium"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Sorting Controls - only show when there are search results */}
      {searchTerm && <SortingControls currentSort={sort} />}

      {/* Search Results */}
      {searchTerm ? (
        <Suspense fallback={<GalleryGridSkeleton />}>
          <SearchResults searchTerm={searchTerm} page={page} sort={sort} />
        </Suspense>
      ) : (
        <div className="text-center py-12 space-y-6">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Start your search
          </h3>
          <p className="text-gray-400 mb-6">
            Enter a search term to find galleries by title, tags, artists,
            characters, or categories
          </p>

          {/* Search Tips */}
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto text-left">
            <h4 className="text-lg font-semibold text-white mb-4">
              💡 Search Tips
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                • Search by title:{" "}
                <code className="bg-gray-700 px-2 py-1 rounded">Love Live</code>
              </li>
              <li>
                • Search by tag:{" "}
                <code className="bg-gray-700 px-2 py-1 rounded">
                  schoolgirl
                </code>
              </li>
              <li>
                • Search by artist:{" "}
                <code className="bg-gray-700 px-2 py-1 rounded">
                  artist:"Artist Name"
                </code>
              </li>
              <li>
                • Search by category:{" "}
                <code className="bg-gray-700 px-2 py-1 rounded">
                  category:Doujinshi
                </code>
              </li>
              <li>
                • Combine terms:{" "}
                <code className="bg-gray-700 px-2 py-1 rounded">
                  big breasts vanilla
                </code>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

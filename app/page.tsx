import { Suspense } from "react";
import { Metadata } from "next";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { SortingControls } from "@/components/ui/SortingControls";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { fetchGalleries } from "@/lib/api";
import { config } from "@/lib/config";
import { GalleryListResponse, SearchParams } from "@/types/gallery";

export const metadata: Metadata = {
  title: "Home",
  description: "Browse the latest hentai galleries and doujinshi",
};

interface HomePageProps {
  searchParams: { page?: string; sort?: string };
}

// Fetch galleries from API
async function fetchGalleriesData(
  page: number = 1,
  sort?: string
): Promise<GalleryListResponse> {
  const params: SearchParams = {
    page,
    limit: config.GALLERIES_PER_PAGE,
    sort,
  };

  return await fetchGalleries(params);
}

async function GalleryGrid({ page, sort }: { page: number; sort?: string }) {
  const { galleries, pagination } = await fetchGalleriesData(page, sort);

  if (!galleries || galleries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No galleries found
        </h3>
        <p className="text-gray-400">
          Check your API connection or try again later.
        </p>
      </div>
    );
  }

  return (
    <>
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
          baseUrl="/"
          searchParams={
            new URLSearchParams({
              page: page.toString(),
              ...(sort && { sort }),
            })
          }
        />
      )}
    </>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const sort = searchParams.sort;

  // Determine title based on sort
  const getTitle = () => {
    switch (sort) {
      case config.SORT_OPTIONS.POPULAR:
        return "🔥 Popular Galleries";
      case config.SORT_OPTIONS.HOT:
        return "💥 Hot Galleries";
      case config.SORT_OPTIONS.DATE:
        return "📅 Galleries by Date";
      case config.SORT_OPTIONS.ALPHABETICAL:
        return "🔤 Galleries A-Z";
      case config.SORT_OPTIONS.PAGES:
        return "📄 Longest Galleries";
      default:
        return "🆕 Latest Galleries";
    }
  };

  return (
    <div className="space-y-8">
      {/* New Menu */}
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <div className="flex space-x-4">
          <a href="/categories" className="text-white hover:text-pink-500">
            Categories
          </a>
          <a href="/tags" className="text-white hover:text-pink-500">
            Tags
          </a>
          <a href="/languages" className="text-white hover:text-pink-500">
            Languages
          </a>
        </div>
        <div className="text-white">✨ HD Quality</div>
      </div>

      {/* Gallery Grid */}
      <GalleryGrid page={page} sort={sort} />
    </div>
  );
}

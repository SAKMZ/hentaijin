import { Suspense } from "react";
import { Metadata } from "next";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { fetchGalleries } from "@/lib/api";
import { config } from "@/lib/config";
import { GalleryListResponse, SearchParams } from "@/types/gallery";

export const metadata: Metadata = {
  title: "Home",
  description: "Browse the latest hentai galleries and doujinshi",
};

interface HomePageProps {
  searchParams: { page?: string };
}

// Fetch galleries from API
async function fetchGalleriesData(page: number = 1): Promise<GalleryListResponse> {
  const params: SearchParams = {
    page,
    limit: config.GALLERIES_PER_PAGE,
  };
  
  return await fetchGalleries(params);
}

async function GalleryGrid({ page }: { page: number }) {
  const { galleries, pagination } = await fetchGalleriesData(page);

  if (!galleries || galleries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-white mb-2">No galleries found</h3>
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
          <GalleryCard key={gallery.id} gallery={gallery} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination}
          baseUrl="/"
          searchParams={new URLSearchParams({ page: page.toString() })}
        />
      )}
    </>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Welcome to <span className="text-primary">{config.SITE_NAME}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and explore a vast collection of hentai galleries, manga, and
          doujinshi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-pink-500">∞</div>
          <div className="text-sm text-gray-400">Galleries</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-pink-500">✨</div>
          <div className="text-sm text-gray-400">HD Quality</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-pink-500">🏷️</div>
          <div className="text-sm text-gray-400">Tagged</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-pink-500">🌐</div>
          <div className="text-sm text-gray-400">Multi-Lang</div>
        </div>
      </div>

      {/* Latest Galleries */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Latest Galleries
          </h2>
          <div className="text-sm text-muted-foreground">Page {page}</div>
        </div>

        <Suspense fallback={<GalleryGridSkeleton />}>
          <GalleryGrid page={page} />
        </Suspense>
      </div>
    </div>
  );
}

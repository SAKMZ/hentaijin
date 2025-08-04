import { Suspense } from "react";
import { Metadata } from "next";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { generateMockGalleries } from "@/lib/mockData";
import { config } from "@/lib/config";
import { GalleryResponse } from "@/types/gallery";

export const metadata: Metadata = {
  title: "Home",
  description: "Browse the latest hentai galleries and doujinshi",
};

interface HomePageProps {
  searchParams: { page?: string };
}

// Mock API call function
async function fetchGalleries(page: number = 1): Promise<GalleryResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const totalGalleries = 500; // Mock total
  const galleries = generateMockGalleries(totalGalleries);
  const startIndex = (page - 1) * config.GALLERIES_PER_PAGE;
  const endIndex = startIndex + config.GALLERIES_PER_PAGE;
  const paginatedGalleries = galleries.slice(startIndex, endIndex);

  return {
    galleries: paginatedGalleries,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalGalleries / config.GALLERIES_PER_PAGE),
      totalItems: totalGalleries,
      hasNext: endIndex < totalGalleries,
      hasPrev: page > 1,
    },
  };
}

async function GalleryGrid({ page }: { page: number }) {
  const { galleries, pagination } = await fetchGalleries(page);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {galleries.map((gallery) => (
          <GalleryCard key={gallery.id} gallery={gallery} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        baseUrl="/"
        searchParams={new URLSearchParams({ page: page.toString() })}
      />
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
        <div className="bg-card p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">500+</div>
          <div className="text-sm text-muted-foreground">Galleries</div>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">50+</div>
          <div className="text-sm text-muted-foreground">Artists</div>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">100+</div>
          <div className="text-sm text-muted-foreground">Tags</div>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">4</div>
          <div className="text-sm text-muted-foreground">Languages</div>
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

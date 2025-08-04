import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { generateMockGalleries } from "@/lib/mockData";
import { config } from "@/lib/config";
import { GalleryResponse } from "@/types/gallery";

interface TagPageProps {
  params: { tagName: string };
  searchParams: { page?: string };
}

// Mock API call function
async function fetchGalleriesByTag(
  tag: string,
  page: number = 1
): Promise<GalleryResponse | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const decodedTag = decodeURIComponent(tag);
  let galleries = generateMockGalleries(300);

  // Filter by tag
  galleries = galleries.filter((g) =>
    g.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase())
  );

  if (galleries.length === 0) {
    return null;
  }

  // Pagination
  const startIndex = (page - 1) * config.GALLERIES_PER_PAGE;
  const endIndex = startIndex + config.GALLERIES_PER_PAGE;
  const paginatedGalleries = galleries.slice(startIndex, endIndex);

  return {
    galleries: paginatedGalleries,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(galleries.length / config.GALLERIES_PER_PAGE),
      totalItems: galleries.length,
      hasNext: endIndex < galleries.length,
      hasPrev: page > 1,
    },
  };
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const tagName = decodeURIComponent(params.tagName);

  return {
    title: `Tag: ${tagName}`,
    description: `Browse hentai galleries tagged with "${tagName}"`,
    openGraph: {
      title: `Tag: ${tagName} | ${config.SITE_NAME}`,
      description: `Browse galleries tagged with "${tagName}"`,
    },
  };
}

async function TagContent({
  tagName,
  page,
}: {
  tagName: string;
  page: number;
}) {
  const result = await fetchGalleriesByTag(tagName, page);

  if (!result) {
    notFound();
  }

  const { galleries, pagination } = result;
  const decodedTag = decodeURIComponent(tagName);

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Tag: <span className="text-primary">#{decodedTag}</span>
          </h2>
          <p className="text-muted-foreground">
            {pagination.totalItems} galleries tagged with "{decodedTag}"
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      </div>

      {/* Tag Stats */}
      <div className="bg-card rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {pagination.totalItems}
            </div>
            <div className="text-sm text-muted-foreground">Total Galleries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Math.ceil(pagination.totalItems / 10)}
            </div>
            <div className="text-sm text-muted-foreground">Est. Artists</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {["English", "Japanese", "Chinese", "Korean"].length}
            </div>
            <div className="text-sm text-muted-foreground">Languages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Math.ceil(pagination.totalItems * 15)}
            </div>
            <div className="text-sm text-muted-foreground">Total Pages</div>
          </div>
        </div>
      </div>

      {/* Popular Related Tags */}
      <div className="bg-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Related Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {["related1", "related2", "related3", "related4", "related5"].map(
            (relatedTag) => (
              <a
                key={relatedTag}
                href={`/tag/${relatedTag}`}
                className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
              >
                #{relatedTag}
              </a>
            )
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {galleries.map((gallery) => (
          <GalleryCard key={gallery.id} gallery={gallery} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        baseUrl={`/tag/${encodeURIComponent(decodedTag)}`}
        searchParams={new URLSearchParams({ page: page.toString() })}
      />
    </div>
  );
}

export default function TagPage({ params, searchParams }: TagPageProps) {
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <div className="space-y-8">
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded w-64 animate-pulse" />
              <div className="h-4 bg-muted rounded w-48 animate-pulse" />
            </div>
            <GalleryGridSkeleton />
          </div>
        }
      >
        <TagContent tagName={params.tagName} page={page} />
      </Suspense>
    </div>
  );
}

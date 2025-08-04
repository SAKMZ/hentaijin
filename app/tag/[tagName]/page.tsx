import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { searchGalleries } from "@/lib/api";
import { config } from "@/lib/config";
import { GalleryListResponse } from "@/types/gallery";

interface TagPageProps {
  params: { tagName: string };
  searchParams: { page?: string };
}

// Search galleries by tag using API
async function fetchGalleriesByTag(
  tag: string,
  page: number = 1
): Promise<GalleryListResponse | null> {
  try {
    const decodedTag = decodeURIComponent(tag);
    const result = await searchGalleries(decodedTag, page);
    
    if (!result.galleries || result.galleries.length === 0) {
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Failed to fetch galleries by tag:', error);
    return null;
  }
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
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Tag: <span className="text-pink-500">#{decodedTag}</span>
          </h2>
          <p className="text-gray-400">
            {pagination?.totalItems || galleries.length} galleries tagged with "{decodedTag}"
          </p>
        </div>
        {pagination && (
          <div className="text-sm text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        )}
      </div>

      {/* Tag Stats */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-pink-500">
              {pagination?.totalItems || galleries.length}
            </div>
            <div className="text-sm text-gray-400">Total Galleries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-500">
              #{decodedTag}
            </div>
            <div className="text-sm text-gray-400">Current Tag</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-500">
              🔍
            </div>
            <div className="text-sm text-gray-400">Searchable</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-500">
              📱
            </div>
            <div className="text-sm text-gray-400">Mobile Ready</div>
          </div>
        </div>
      </div>

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
          baseUrl={`/tag/${encodeURIComponent(decodedTag)}`}
          searchParams={new URLSearchParams({ page: page.toString() })}
        />
      )}
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
              <div className="h-8 bg-gray-700 rounded w-64 animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-48 animate-pulse" />
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

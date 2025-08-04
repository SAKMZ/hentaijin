import { Suspense } from "react";
import { Metadata } from "next";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { getGalleriesByField } from "@/lib/collections";
import { config } from "@/lib/config";

interface ArtistPageProps {
  params: { artistName: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const artistName = decodeURIComponent(params.artistName);
  return {
    title: `${artistName} - Artists`,
    description: `Browse galleries by ${artistName}`,
  };
}

async function ArtistGalleries({ artistName, page }: { artistName: string; page: number }) {
  const { galleries, pagination } = await getGalleriesByField(
    'artists',
    artistName,
    page,
    config.GALLERIES_PER_PAGE
  );

  if (!galleries || galleries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🎨</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No galleries found
        </h3>
        <p className="text-gray-400">
          No galleries found by "{artistName}".
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {galleries.map((gallery) => (
          <GalleryCard key={gallery.hentai_id} gallery={gallery} />
        ))}
      </div>

      {pagination && (
        <Pagination
          pagination={pagination}
          baseUrl={`/artist/${encodeURIComponent(artistName)}`}
          searchParams={new URLSearchParams({ page: page.toString() })}
        />
      )}
    </>
  );
}

export default function ArtistPage({ params, searchParams }: ArtistPageProps) {
  const artistName = decodeURIComponent(params.artistName);
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Artist: <span className="text-pink-500">{artistName}</span>
        </h1>
        <p className="text-lg text-gray-400">
          Galleries by {artistName}
        </p>
      </div>

      <Suspense fallback={<GalleryGridSkeleton />}>
        <ArtistGalleries artistName={artistName} page={page} />
      </Suspense>
    </div>
  );
}
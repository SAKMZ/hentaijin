import { Suspense } from "react";
import { Metadata } from "next";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { getGalleriesByField } from "@/lib/collections";
import { config } from "@/lib/config";

interface CharacterPageProps {
  params: { characterName: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const characterName = decodeURIComponent(params.characterName);
  return {
    title: `${characterName} - Characters`,
    description: `Browse galleries featuring ${characterName}`,
  };
}

async function CharacterGalleries({ characterName, page }: { characterName: string; page: number }) {
  const { galleries, pagination } = await getGalleriesByField(
    'characters',
    characterName,
    page,
    config.GALLERIES_PER_PAGE
  );

  if (!galleries || galleries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">👤</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No galleries found
        </h3>
        <p className="text-gray-400">
          No galleries found featuring "{characterName}".
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
          baseUrl={`/character/${encodeURIComponent(characterName)}`}
          searchParams={new URLSearchParams({ page: page.toString() })}
        />
      )}
    </>
  );
}

export default function CharacterPage({ params, searchParams }: CharacterPageProps) {
  const characterName = decodeURIComponent(params.characterName);
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Character: <span className="text-pink-500">{characterName}</span>
        </h1>
        <p className="text-lg text-gray-400">
          Galleries featuring {characterName}
        </p>
      </div>

      <Suspense fallback={<GalleryGridSkeleton />}>
        <CharacterGalleries characterName={characterName} page={page} />
      </Suspense>
    </div>
  );
}
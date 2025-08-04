import { Suspense } from "react";
import { Metadata } from "next";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { getGalleriesByField } from "@/lib/collections";
import { config } from "@/lib/config";

interface CategoryPageProps {
  params: { categoryName: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.categoryName);
  return {
    title: `${categoryName} - Categories`,
    description: `Browse ${categoryName} hentai galleries`,
  };
}

async function CategoryGalleries({ categoryName, page }: { categoryName: string; page: number }) {
  const { galleries, pagination } = await getGalleriesByField(
    'categories',
    categoryName,
    page,
    config.GALLERIES_PER_PAGE
  );

  if (!galleries || galleries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📂</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No galleries found
        </h3>
        <p className="text-gray-400">
          No galleries found in the "{categoryName}" category.
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
          baseUrl={`/category/${encodeURIComponent(categoryName)}`}
          searchParams={new URLSearchParams({ page: page.toString() })}
        />
      )}
    </>
  );
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.categoryName);
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Category: <span className="text-pink-500">{categoryName}</span>
        </h1>
        <p className="text-lg text-gray-400">
          Galleries in the {categoryName} category
        </p>
      </div>

      <Suspense fallback={<GalleryGridSkeleton />}>
        <CategoryGalleries categoryName={categoryName} page={page} />
      </Suspense>
    </div>
  );
}
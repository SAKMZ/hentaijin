import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery, ImageTokenConfig } from "@/types/gallery";
import { generateMockGalleries } from "@/lib/mockData";
import { formatNumber, formatDate, generateImageUrl } from "@/lib/utils";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import GalleryImage from "@/components/ui/GalleryImage";

interface GalleryPageProps {
  params: { id: string };
}

// Mock API call function
async function fetchGallery(id: string): Promise<Gallery | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const galleries = generateMockGalleries(100);
  return galleries.find((g) => g.id === id) || null;
}

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const gallery = await fetchGallery(params.id);

  if (!gallery) {
    return {
      title: "Gallery Not Found",
    };
  }

  return {
    title: gallery.title,
    description: `${gallery.title} by ${gallery.artist} - ${gallery.totalPages} pages`,
    openGraph: {
      title: gallery.title,
      description: `${gallery.title} by ${gallery.artist}`,
      images: [{ url: gallery.coverImage }],
    },
  };
}

// Gallery image wrapper with token config
function TokenizedGalleryImage({
  gallery,
  index,
}: {
  gallery: Gallery;
  index: number;
}) {
  if (!gallery.token) {
    return (
      <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg aspect-[2/3] flex items-center justify-center">
        <div className="text-red-400">No token available</div>
      </div>
    );
  }

  const tokenConfig: ImageTokenConfig = {
    galleryId: gallery.id,
    token: gallery.token,
    imageIndex: index,
    format: gallery.imageFormat || 'webp',
  };

  return (
    <GalleryImage
      tokenConfig={tokenConfig}
      alt={gallery.title}
      className="aspect-[2/3]"
      showPageNumber={true}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

async function GalleryContent({ id }: { id: string }) {
  const gallery = await fetchGallery(id);

  if (!gallery) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Gallery Header */}
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            <div className="relative w-48 aspect-[3/4] bg-muted rounded-lg overflow-hidden shadow-lg mx-auto lg:mx-0">
              <Image
                src={gallery.coverImage}
                alt={gallery.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Gallery Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {gallery.title}
              </h1>
              <Link
                href={`/search?artist=${encodeURIComponent(gallery.artist)}`}
                className="text-xl text-primary hover:text-primary/80 transition-colors"
              >
                by {gallery.artist}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Pages</div>
                <div className="font-semibold">{gallery.totalPages}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Views</div>
                <div className="font-semibold">
                  {formatNumber(gallery.views)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Language</div>
                <div className="font-semibold">{gallery.language}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Uploaded</div>
                <div className="font-semibold">
                  {formatDate(gallery.uploadDate)}
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <span className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                {gallery.category}
              </span>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Tags:
              </div>
              <div className="flex flex-wrap gap-2">
                {gallery.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Favorite
              </button>
              <button className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Gallery Images ({gallery.totalPages} pages)
          </h2>
          <div className="text-sm text-muted-foreground">
            Click images to view full size
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: gallery.totalPages }, (_, index) => (
            <TokenizedGalleryImage
              key={index}
              gallery={gallery}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Related Galleries */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">Related Galleries</h3>
        <p className="text-muted-foreground">
          More galleries by {gallery.artist} or with similar tags coming soon...
        </p>
      </div>
    </div>
  );
}

export default function GalleryPage({ params }: GalleryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div className="bg-card rounded-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <SkeletonLoader className="w-48 aspect-[3/4] mx-auto lg:mx-0" />
              <div className="flex-1 space-y-4">
                <SkeletonLoader className="h-8 w-2/3" />
                <SkeletonLoader className="h-6 w-1/2" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonLoader key={i} className="h-12" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonLoader key={i} className="aspect-[2/3]" />
            ))}
          </div>
        </div>
      }
    >
      <GalleryContent id={params.id} />
    </Suspense>
  );
}

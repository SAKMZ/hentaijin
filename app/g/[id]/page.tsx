import { Suspense } from "react";
import { Metadata } from "next/head";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/types/gallery";
import { generateMockGalleries } from "@/lib/mockData";
import { formatNumber, formatDate } from "@/lib/utils";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

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

function GalleryImage({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  return (
    <div className="relative bg-muted rounded-lg overflow-hidden shadow-lg">
      <Image
        src={src}
        alt={`${alt} - Page ${index + 1}`}
        width={800}
        height={1200}
        className="w-full h-auto object-contain"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      {/* Page Number Overlay */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
        {index + 1}
      </div>
    </div>
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
          {gallery.images.map((imageUrl, index) => (
            <GalleryImage
              key={index}
              src={imageUrl}
              alt={gallery.title}
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

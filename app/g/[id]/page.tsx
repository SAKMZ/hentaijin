import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryDetail } from "@/types/gallery";
import { fetchGalleryDetail } from "@/lib/api";
import { formatUploadDate } from "@/lib/utils";
import { config } from "@/lib/config";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

interface GalleryPageProps {
  params: { id: string };
}

// Fetch gallery metadata for SEO from CDN
async function fetchGalleryMetadata(
  hentai_id: string
): Promise<GalleryDetail | null> {
  try {
    return await fetchGalleryDetail(hentai_id);
  } catch (error) {
    console.error("Failed to fetch gallery metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const gallery = await fetchGalleryMetadata(params.id);

  if (!gallery) {
    return {
      title: "Gallery Not Found",
      description: "The requested gallery could not be found.",
    };
  }

  const description = `${gallery.title} - ${
    gallery.pages
  } pages - ${gallery.languages.join(", ")} - By ${gallery.artists.join(", ")}`;

  return {
    title: `${gallery.title} | ${config.SITE_NAME}`,
    description,
    openGraph: {
      title: gallery.title,
      description,
      images: [{ url: gallery.images[0] || "" }],
    },
    twitter: {
      card: "summary_large_image",
      title: gallery.title,
      description,
      images: [gallery.images[0] || ""],
    },
  };
}

// Simple gallery image component
function SimpleGalleryImage({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
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

async function GalleryContent({ hentai_id }: { hentai_id: string }) {
  const galleryData = await fetchGalleryDetail(hentai_id);

  if (!galleryData) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Gallery Header */}
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            <div className="relative w-48 aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden shadow-lg mx-auto lg:mx-0">
              <Image
                src={galleryData.images[0] || config.FALLBACK_URLS.ERROR}
                alt={galleryData.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Gallery Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {galleryData.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-2">
                {galleryData.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Artists */}
            {galleryData.artists.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-400 mb-1">
                  Artists:
                </div>
                <div className="flex flex-wrap gap-2">
                  {galleryData.artists.map((artist) => (
                    <Link
                      key={artist}
                      href={`/search?search=${encodeURIComponent(
                        `artist:"${artist}"`
                      )}`}
                      className="inline-flex items-center px-3 py-1 bg-pink-600 text-white rounded-full text-sm hover:bg-pink-700 transition-colors"
                    >
                      {artist}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Pages</div>
                <div className="font-semibold text-white">
                  {galleryData.pages}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Languages</div>
                <div className="font-semibold text-white capitalize">
                  {galleryData.languages.join(", ")}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Uploaded</div>
                <div className="font-semibold text-white">
                  {formatUploadDate(galleryData.uploaded)}
                </div>
              </div>
              <div>
                <div className="text-gray-400">ID</div>
                <div className="font-semibold text-white">
                  {galleryData.hentai_id}
                </div>
              </div>
            </div>

            {/* Popularity & Favorites */}
            {(galleryData.popularity || galleryData.favorites) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {galleryData.popularity && (
                  <div>
                    <div className="text-gray-400">Popularity</div>
                    <div className="font-semibold text-yellow-400 flex items-center gap-1">
                      🔥 {galleryData.popularity.toLocaleString()}
                    </div>
                  </div>
                )}
                {galleryData.favorites && (
                  <div>
                    <div className="text-gray-400">Favorites</div>
                    <div className="font-semibold text-red-400 flex items-center gap-1">
                      ❤️ {galleryData.favorites.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-400">Tags:</div>
              <div className="flex flex-wrap gap-2">
                {galleryData.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?search=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm hover:bg-gray-600 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Description */}
            {galleryData.description && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-400">
                  Description:
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {galleryData.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
                ❤️ Favorite
              </button>
              <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
                📤 Share
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                📱 Mobile View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Gallery Images ({galleryData.images.length} pages)
          </h2>
          <div className="text-sm text-gray-400">
            Click images to view full size
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryData.images.map((imageUrl, index) => (
            <SimpleGalleryImage
              key={index}
              src={imageUrl}
              alt={galleryData.title}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          ← Back to Gallery
        </Link>
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
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonLoader key={i} className="h-6 w-16" />
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
      <GalleryContent hentai_id={params.id} />
    </Suspense>
  );
}

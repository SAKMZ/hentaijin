import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery, GalleryDetail } from "@/types/gallery";
import { fetchGalleries, fetchGalleryDetail } from "@/lib/api";
import { formatNumber, formatDate } from "@/lib/utils";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

interface GalleryPageProps {
  params: { id: string };
}

// Fetch gallery metadata for SEO from your MongoDB API
async function fetchGalleryMetadata(id: string): Promise<Gallery | null> {
  try {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://128.140.78.75";
    const response = await fetch(`${API_BASE}/api/gallery/${id}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
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
    };
  }

  return {
    title: gallery.title,
    description: `${gallery.title} - ${gallery.totalImages} images - ${gallery.language}`,
    openGraph: {
      title: gallery.title,
      description: `${gallery.title} - ${gallery.totalImages} images`,
      images: [{ url: gallery.thumbnail }],
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
        alt={`${alt} - Image ${index + 1}`}
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
  // Fetch both gallery metadata and image list
  const [galleryMetadata, galleryImages] = await Promise.all([
    fetchGalleryMetadata(id),
    fetchGalleryDetail(id),
  ]);

  if (!galleryMetadata || !galleryImages) {
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
                src={galleryMetadata.thumbnail}
                alt={galleryMetadata.title}
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
                {galleryMetadata.title}
              </h1>
              <p className="text-xl text-gray-400 capitalize">
                {galleryMetadata.language}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Images</div>
                <div className="font-semibold text-white">
                  {galleryMetadata.totalImages}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Language</div>
                <div className="font-semibold text-white capitalize">
                  {galleryMetadata.language}
                </div>
              </div>
              <div>
                <div className="text-gray-400">ID</div>
                <div className="font-semibold text-white">
                  {galleryMetadata.id}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-400">Tags:</div>
              <div className="flex flex-wrap gap-2">
                {galleryMetadata.tags.map((tag) => (
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

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
                Favorite
              </button>
              <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Gallery Images ({galleryImages.images.length} images)
          </h2>
          <div className="text-sm text-gray-400">
            Click images to view full size
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.images.map((imageUrl, index) => (
            <SimpleGalleryImage
              key={index}
              src={imageUrl}
              alt={galleryMetadata.title}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Related Galleries */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Related Galleries</h3>
        <p className="text-gray-400">
          More galleries with similar tags coming soon...
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

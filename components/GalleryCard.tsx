"use client";

import Image from "next/image";
import Link from "next/link";
import { Gallery } from "@/types/gallery";
import { formatNumber } from "@/lib/utils";
import { getThumbnailUrl } from "@/lib/config";

interface GalleryCardProps {
  gallery: Gallery;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ gallery }) => {
  const thumbnailUrl = getThumbnailUrl(gallery.id);

  return (
    <Link href={`/g/${gallery.id}`} className="group block">
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
          <Image
            src={thumbnailUrl}
            alt={gallery.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            unoptimized
          />
          {/* Language Badge */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-pink-600 text-white rounded-full">
              {gallery.language}
            </span>
          </div>
          {/* Views Badge */}
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full">
              {formatNumber(gallery.views)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 group-hover:text-pink-400 transition-colors">
            {gallery.title}
          </h3>

          {/* Artist */}
          <p className="text-gray-400 text-xs mb-2 truncate">
            by {gallery.artist}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {gallery.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
            {gallery.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                +{gallery.tags.length - 3}
              </span>
            )}
          </div>

          {/* ZIP indicator */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-xs">
              WebP Gallery
            </p>
            <div className="text-xs text-pink-400 font-medium">
              ZIP
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

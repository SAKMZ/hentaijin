"use client";

import Image from "next/image";
import Link from "next/link";
import { Gallery } from "@/types/gallery";
import { formatNumber, generateCoverUrl, generateDummyToken } from "@/lib/utils";
import { useState } from "react";

interface GalleryCardProps {
  gallery: Gallery;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ gallery }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Generate cover URL with token
  const coverUrl = gallery.coverImage || (gallery.token 
    ? generateCoverUrl(gallery.id, gallery.token, gallery.imageFormat || 'webp')
    : generateCoverUrl(gallery.id, generateDummyToken(gallery.id), gallery.imageFormat || 'webp')
  );
  
  const fallbackUrl = `https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Gallery+${gallery.id}`;

  return (
    <Link href={`/g/${gallery.id}`} className="group block">
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
          {/* Loading State */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            </div>
          )}
          
          {/* Error State */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">⚠️</div>
                <div className="text-gray-500 text-xs">Failed to load</div>
              </div>
            </div>
          )}
          
          <Image
            src={imageError ? fallbackUrl : coverUrl}
            alt={gallery.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className={`object-cover transition-all duration-300 group-hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
          
          {/* Format Badge */}
          {gallery.imageFormat && gallery.imageFormat !== 'webp' && (
            <div className="absolute bottom-2 left-2">
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-blue-600/80 text-white rounded uppercase">
                {gallery.imageFormat}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-card-foreground text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {gallery.title}
          </h3>

          {/* Artist */}
          <p className="text-muted-foreground text-xs mb-2 truncate">
            by {gallery.artist}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {gallery.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
            {gallery.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full">
                +{gallery.tags.length - 3}
              </span>
            )}
          </div>

          {/* Page Count */}
          <p className="text-muted-foreground text-xs">
            {gallery.totalPages} pages
          </p>
        </div>
      </div>
    </Link>
  );
};

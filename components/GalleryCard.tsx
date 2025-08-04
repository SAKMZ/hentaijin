"use client";

import Image from "next/image";
import Link from "next/link";
import { Gallery } from "@/types/gallery";
import { formatNumber } from "@/lib/utils";

interface GalleryCardProps {
  gallery: Gallery;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ gallery }) => {
  return (
    <Link href={`/g/${gallery.id}`} className="group block">
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={gallery.coverImage}
            alt={gallery.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          {/* Language Badge */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
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

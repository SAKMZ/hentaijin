'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ZipExtractor, GalleryImage } from '@/lib/zipUtils';
import { getGalleryZipUrl } from '@/lib/config';

interface GalleryViewerProps {
  galleryId: string;
  title: string;
  artist?: string;
  tags?: string[];
}

export function GalleryViewer({ galleryId, title, artist, tags = [] }: GalleryViewerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const zipUrl = getGalleryZipUrl(galleryId);
        const extractedImages = await ZipExtractor.extractGalleryZip(zipUrl);
        
        if (mounted) {
          setImages(extractedImages);
          setLoadedCount(0);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load gallery');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadGallery();

    return () => {
      mounted = false;
      // Cleanup blob URLs when component unmounts
      if (images.length > 0) {
        ZipExtractor.cleanupImageUrls(images);
      }
    };
  }, [galleryId]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleImageLoad = useCallback(() => {
    setLoadedCount(prev => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="text-gray-400">Loading gallery...</p>
          <p className="text-sm text-gray-500">Extracting images from ZIP file</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="text-6xl">😞</div>
          <h3 className="text-xl font-semibold text-white">Gallery Not Found</h3>
          <p className="text-gray-400 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{title}</h1>
        {artist && (
          <p className="text-lg text-pink-400 mb-3">by {artist}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-sm text-gray-400 space-y-1">
          <div>Total Images: {images.length}</div>
          <div>Loaded: {loadedCount}/{images.length}</div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4">
        {images.map((image) => (
          <div
            key={image.filename}
            className="relative bg-gray-900 rounded-md overflow-hidden"
          >
            {/* Page Number */}
            <div className="absolute top-2 left-2 z-10 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
              {image.index}
            </div>
            
            {/* Image */}
            <div className="relative w-full">
              <Image
                src={image.url}
                alt={`Page ${image.index}`}
                width={800}
                height={1200}
                className="w-full h-auto object-contain"
                onLoad={handleImageLoad}
                loading="lazy"
                unoptimized // Since we're using blob URLs
              />
            </div>
          </div>
        ))}
      </div>

      {/* Scroll to Top Button */}
      {images.length > 5 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
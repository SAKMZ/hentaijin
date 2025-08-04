'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ImageLoadState, ImageTokenConfig } from '@/types/gallery';
import { generateImageUrl } from '@/lib/utils';
import { config } from '@/lib/config';

interface GalleryImageProps {
  tokenConfig: ImageTokenConfig;
  alt?: string;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  showPageNumber?: boolean;
  sizes?: string;
}

export const GalleryImage: React.FC<GalleryImageProps> = ({
  tokenConfig,
  alt,
  priority = false,
  className = '',
  onLoad,
  onError,
  showPageNumber = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}) => {
  const [loadState, setLoadState] = useState<ImageLoadState>({
    src: generateImageUrl(tokenConfig),
    loaded: false,
    error: false,
    retryCount: 0,
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const { imageIndex } = tokenConfig;

  // Generate retry URL with cache busting
  const generateRetryUrl = useCallback((retryCount: number) => {
    const baseUrl = generateImageUrl(tokenConfig);
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}retry=${retryCount}&t=${Date.now()}`;
  }, [tokenConfig]);

  // Handle successful image load
  const handleLoad = useCallback(() => {
    setLoadState(prev => ({ ...prev, loaded: true, error: false }));
    onLoad?.();
  }, [onLoad]);

  // Handle image load error with retry logic
  const handleError = useCallback(() => {
    setLoadState(prev => {
      const newRetryCount = prev.retryCount + 1;
      
      if (newRetryCount <= config.IMAGES.MAX_RETRY_ATTEMPTS) {
        // Schedule retry after delay
        retryTimeoutRef.current = setTimeout(() => {
          const retrySrc = generateRetryUrl(newRetryCount);
          setLoadState(curr => ({
            ...curr,
            src: retrySrc,
            retryCount: newRetryCount,
            error: false,
          }));
        }, config.IMAGES.RETRY_DELAY * newRetryCount); // Exponential backoff

        return {
          ...prev,
          retryCount: newRetryCount,
          error: false,
        };
      } else {
        // Max retries reached, show error state
        const error = new Error(`Failed to load image after ${config.IMAGES.MAX_RETRY_ATTEMPTS} attempts`);
        onError?.(error);
        
        return {
          ...prev,
          error: true,
          src: config.FALLBACK_URLS.ERROR,
        };
      }
    });
  }, [generateRetryUrl, onError]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Reset state when tokenConfig changes
  useEffect(() => {
    const newSrc = generateImageUrl(tokenConfig);
    setLoadState({
      src: newSrc,
      loaded: false,
      error: false,
      retryCount: 0,
    });
  }, [tokenConfig]);

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* Loading placeholder */}
      {!loadState.loaded && !loadState.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <div className="text-sm text-gray-400">
              {loadState.retryCount > 0 ? `Retry ${loadState.retryCount}...` : 'Loading...'}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {loadState.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="flex flex-col items-center space-y-2 p-4 text-center">
            <div className="text-red-400 text-2xl">⚠️</div>
            <div className="text-sm text-gray-400">Failed to load image</div>
            <button
              onClick={() => {
                const retrySrc = generateImageUrl(tokenConfig);
                setLoadState({
                  src: retrySrc,
                  loaded: false,
                  error: false,
                  retryCount: 0,
                });
              }}
              className="px-3 py-1 bg-pink-600 text-white text-xs rounded hover:bg-pink-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main image */}
      <Image
        src={loadState.src}
        alt={alt || `Gallery image ${imageIndex + 1}`}
        fill
        sizes={sizes}
        className={`object-contain transition-opacity duration-300 ${
          loadState.loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        quality={config.IMAGES.QUALITY}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />

      {/* Page number overlay */}
      {showPageNumber && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
          {imageIndex + 1}
        </div>
      )}

      {/* Loading progress indicator */}
      {!loadState.loaded && !loadState.error && loadState.retryCount > 0 && (
        <div className="absolute top-2 left-2 bg-yellow-600/80 text-white px-2 py-1 rounded text-xs">
          Attempt {loadState.retryCount + 1}/{config.IMAGES.MAX_RETRY_ATTEMPTS + 1}
        </div>
      )}
    </div>
  );
};

export default GalleryImage;
'use client';

import { useEffect, useCallback, useRef } from 'react';
import { ImageTokenConfig } from '@/types/gallery';
import { generateImageUrl } from '@/lib/utils';
import { config } from '@/lib/config';

interface PreloadedImage {
  src: string;
  loaded: boolean;
  error: boolean;
}

interface UseImagePreloaderProps {
  tokenConfigs: ImageTokenConfig[];
  currentIndex: number;
  preloadBuffer?: number;
}

export const useImagePreloader = ({
  tokenConfigs,
  currentIndex,
  preloadBuffer = config.IMAGES.PRELOAD_BUFFER,
}: UseImagePreloaderProps) => {
  const preloadedImages = useRef<Map<string, PreloadedImage>>(new Map());
  const preloadQueue = useRef<Set<string>>(new Set());

  // Preload an image
  const preloadImage = useCallback((tokenConfig: ImageTokenConfig): Promise<void> => {
    const src = generateImageUrl(tokenConfig);
    
    if (preloadedImages.current.has(src) || preloadQueue.current.has(src)) {
      return Promise.resolve();
    }

    preloadQueue.current.add(src);

    return new Promise((resolve) => {
      const img = new globalThis.Image();
      
      const cleanup = () => {
        preloadQueue.current.delete(src);
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        preloadedImages.current.set(src, { src, loaded: true, error: false });
        cleanup();
        resolve();
      };

      img.onerror = () => {
        preloadedImages.current.set(src, { src, loaded: false, error: true });
        cleanup();
        resolve();
      };

      img.src = src;
    });
  }, []);

  // Get indices to preload based on current position
  const getPreloadIndices = useCallback(
    (current: number): number[] => {
      const indices: number[] = [];
      const maxIndex = tokenConfigs.length - 1;

      // Preload next images
      for (let i = 1; i <= preloadBuffer; i++) {
        const nextIndex = current + i;
        if (nextIndex <= maxIndex) {
          indices.push(nextIndex);
        }
      }

      // Preload previous images
      for (let i = 1; i <= preloadBuffer; i++) {
        const prevIndex = current - i;
        if (prevIndex >= 0) {
          indices.push(prevIndex);
        }
      }

      return indices;
    },
    [preloadBuffer, tokenConfigs.length]
  );

  // Preload images around current index
  const preloadAroundCurrent = useCallback(async () => {
    const indicesToPreload = getPreloadIndices(currentIndex);
    
    // Always ensure current image is marked for preload
    const currentConfig = tokenConfigs[currentIndex];
    if (currentConfig) {
      await preloadImage(currentConfig);
    }

    // Preload surrounding images
    const preloadPromises = indicesToPreload.map(index => {
      const config = tokenConfigs[index];
      return config ? preloadImage(config) : Promise.resolve();
    });

    await Promise.allSettled(preloadPromises);
  }, [currentIndex, getPreloadIndices, preloadImage, tokenConfigs]);

  // Preload all images in gallery (for small galleries)
  const preloadAll = useCallback(async () => {
    if (tokenConfigs.length <= 20) { // Only for small galleries
      const preloadPromises = tokenConfigs.map(config => preloadImage(config));
      await Promise.allSettled(preloadPromises);
    }
  }, [tokenConfigs, preloadImage]);

  // Check if image is preloaded
  const isPreloaded = useCallback((tokenConfig: ImageTokenConfig): boolean => {
    const src = generateImageUrl(tokenConfig);
    const preloaded = preloadedImages.current.get(src);
    return preloaded?.loaded === true;
  }, []);

  // Get preload status
  const getPreloadStatus = useCallback((tokenConfig: ImageTokenConfig) => {
    const src = generateImageUrl(tokenConfig);
    return preloadedImages.current.get(src) || { src, loaded: false, error: false };
  }, []);

  // Effect to preload images when current index changes
  useEffect(() => {
    preloadAroundCurrent();
  }, [preloadAroundCurrent]);

  // Clean up old preloaded images to prevent memory leaks
  useEffect(() => {
    const cleanup = () => {
      const currentSources = new Set(tokenConfigs.map(generateImageUrl));
      
      for (const [src] of preloadedImages.current) {
        if (!currentSources.has(src)) {
          preloadedImages.current.delete(src);
        }
      }
    };

    cleanup();
  }, [tokenConfigs]);

  return {
    preloadImage,
    preloadAll,
    isPreloaded,
    getPreloadStatus,
    preloadedCount: preloadedImages.current.size,
  };
};
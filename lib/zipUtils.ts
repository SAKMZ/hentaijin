'use client';

import { unzip } from 'fflate';

export interface GalleryImage {
  filename: string;
  url: string;
  index: number;
}

export class ZipExtractor {
  private static createObjectURL(data: Uint8Array, type: string): string {
    const blob = new Blob([data], { type });
    return URL.createObjectURL(blob);
  }

  static async extractGalleryZip(zipUrl: string): Promise<GalleryImage[]> {
    try {
      // Fetch the ZIP file
      const response = await fetch(zipUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ZIP: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const zipData = new Uint8Array(arrayBuffer);

      // Extract files from ZIP
      return new Promise((resolve, reject) => {
        unzip(zipData, (err, files) => {
          if (err) {
            reject(err);
            return;
          }

          const images: GalleryImage[] = [];
          
          // Filter and sort webp files
          const webpFiles = Object.entries(files)
            .filter(([filename]) => 
              filename.toLowerCase().endsWith('.webp') && 
              !filename.includes('__MACOSX') &&
              !filename.startsWith('.')
            )
            .sort(([a], [b]) => {
              // Natural sort for filenames (1.webp, 2.webp, etc.)
              const aNum = parseInt(a.match(/(\d+)/)?.[1] || '0');
              const bNum = parseInt(b.match(/(\d+)/)?.[1] || '0');
              return aNum - bNum;
            });

          // Create object URLs for each image
          webpFiles.forEach(([filename, data], index) => {
            const url = this.createObjectURL(data, 'image/webp');
            images.push({
              filename,
              url,
              index: index + 1
            });
          });

          resolve(images);
        });
      });
    } catch (error) {
      console.error('Error extracting ZIP:', error);
      throw error;
    }
  }

  static cleanupImageUrls(images: GalleryImage[]): void {
    images.forEach(image => {
      if (image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
    });
  }
}
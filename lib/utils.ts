import { ImageTokenConfig } from '@/types/gallery';
import { config } from './config';

// Utility function for combining class names
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}

// Generate tokenized image URLs
export function generateImageUrl(tokenConfig: ImageTokenConfig): string {
  const { galleryId, token, imageIndex, format = config.IMAGES.FORMAT } = tokenConfig;
  
  // TODO: Replace with actual CDN URL generation
  // For now, use placeholder URLs for development
  if (process.env.NODE_ENV === 'development') {
    return `https://via.placeholder.com/800x1200/${Math.abs(hashCode(galleryId + imageIndex))}a/ffffff?text=Gallery+${galleryId}+Page+${imageIndex + 1}`;
  }
  
  // Production tokenized URL pattern
  const endpoint = config.CDN_ENDPOINTS.GALLERY_IMAGE
    .replace('{galleryId}', galleryId)
    .replace('{token}', token)
    .replace('{imageIndex}', String(imageIndex))
    .replace('{format}', format);
    
  return config.CDN_BASE_URL + endpoint;
}

// Generate cover image URL
export function generateCoverUrl(galleryId: string, token: string, format: 'webp' | 'jpg' | 'png' = config.IMAGES.FORMAT): string {
  // TODO: Replace with actual CDN URL generation
  if (process.env.NODE_ENV === 'development') {
    return `https://via.placeholder.com/300x400/${Math.abs(hashCode(galleryId))}a/ffffff?text=Gallery+${galleryId}+Cover`;
  }
  
  const endpoint = config.CDN_ENDPOINTS.GALLERY_COVER
    .replace('{galleryId}', galleryId)
    .replace('{token}', token)
    .replace('{format}', format);
    
  return config.CDN_BASE_URL + endpoint;
}

// Generate thumbnail URL
export function generateThumbnailUrl(tokenConfig: ImageTokenConfig): string {
  const { galleryId, token, imageIndex, format = config.IMAGES.FORMAT } = tokenConfig;
  
  // TODO: Replace with actual CDN URL generation
  if (process.env.NODE_ENV === 'development') {
    return `https://via.placeholder.com/200x300/${Math.abs(hashCode(galleryId + imageIndex))}a/ffffff?text=Thumb+${imageIndex + 1}`;
  }
  
  const endpoint = config.CDN_ENDPOINTS.GALLERY_THUMBNAIL
    .replace('{galleryId}', galleryId)
    .replace('{token}', token)
    .replace('{imageIndex}', String(imageIndex))
    .replace('{format}', format);
    
  return config.CDN_BASE_URL + endpoint;
}

// Generate dummy token for development (TODO: Replace with backend token generation)
export function generateDummyToken(galleryId: string): string {
  // Simulate a JWT-like token for development
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({ galleryId, exp: timestamp + 3600 }));
  return `dummy.${payload}.${hashCode(galleryId + timestamp)}`;
}

// Validate token (placeholder for backend validation)
export function validateToken(token: string, galleryId: string): boolean {
  // TODO: Implement actual token validation with backend
  if (process.env.NODE_ENV === 'development') {
    return token.startsWith('dummy.');
  }
  
  // Placeholder validation logic
  try {
    // Real implementation would verify JWT signature, expiration, etc.
    return token.length > 0 && galleryId.length > 0;
  } catch {
    return false;
  }
}

// Helper function to create consistent hashes for development
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function generatePageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
}

export interface Gallery {
  id: string;
  title: string;
  artist: string;
  language: string;
  tags: string[];
  category: string;
  coverImage: string;
  totalPages: number;
  uploadDate: string;
  views: number;
  // New tokenized image system
  token?: string; // Placeholder token for dynamic URLs
  imageFormat?: 'webp' | 'jpg' | 'png'; // Default: webp
}

export interface ImageLoadState {
  src: string;
  loaded: boolean;
  error: boolean;
  retryCount: number;
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  artist?: string;
  language?: string;
  category?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GalleryResponse {
  galleries: Gallery[];
  pagination: PaginationInfo;
}

export interface SearchResponse extends GalleryResponse {
  filters: SearchFilters;
}

// New interfaces for tokenized image system
export interface ImageTokenConfig {
  galleryId: string;
  token: string;
  imageIndex: number;
  format?: 'webp' | 'jpg' | 'png';
}

export interface ImageViewerProps {
  gallery: Gallery;
  currentIndex: number;
  onImageChange: (index: number) => void;
  onClose: () => void;
}

// MongoDB Gallery structure
export interface Gallery {
  id: string;
  title: string;
  tags: string[];
  language: string;
  totalImages: number;
  thumbnail: string; // Full CDN URL like "cdn.domain.com/12345/cover.webp"
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

// API Response for individual gallery with images
export interface GalleryDetail {
  id: string;
  images: string[]; // Full CDN URLs like ["cdn.domain.com/12345/1.webp", ...]
}

// API Request/Response interfaces
export interface GalleryListResponse {
  galleries: Gallery[];
  pagination?: PaginationInfo;
}

export interface SearchParams {
  search?: string;
  page?: number;
  limit?: number;
}

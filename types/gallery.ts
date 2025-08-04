// MongoDB Gallery structure  
export interface Gallery {
  id: string; // hentai_id from MongoDB
  title: string;
  tags: string[];
  language: string;
  totalImages: number; // total_images or pages from MongoDB
  thumbnail: string; // Generated CDN URL like "http://128.140.78.75/api/100/01.jpg"
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

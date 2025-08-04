// CDN Gallery structure - similar to nhentai
export interface Gallery {
  hentai_id: string;
  title: string;
  tags: string[];
  artists: string[];
  categories: string[];
  languages: string[];
  pages: number;
  uploaded: number; // Unix timestamp
  thumbnail: string; // Full CDN URL
  popularity?: number; // For sorting by popularity
  favorites?: number; // Favorite count
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
  artists?: string[];
  languages?: string[];
  categories?: string[];
  sort?: string; // popular, new, hot, date, alphabetical, pages
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

// API Response for individual gallery with images and detailed metadata
export interface GalleryDetail {
  hentai_id: string;
  title: string;
  tags: string[];
  artists: string[];
  categories: string[];
  languages: string[];
  pages: number;
  uploaded: number; // Unix timestamp
  images: string[]; // Full CDN URLs like ["cdn.hentaijin.com/12345/01.webp", ...]
  popularity?: number;
  favorites?: number;
  description?: string;
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
  sort?: string; // popular, new, hot, date, alphabetical, pages
  categories?: string[];
  languages?: string[];
  tags?: string[];
}

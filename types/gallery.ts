export interface Gallery {
  id: string;
  title: string;
  artist: string;
  language: string;
  tags: string[];
  category: string;
  coverImage: string;
  images: string[];
  totalPages: number;
  uploadDate: string;
  views: number;
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

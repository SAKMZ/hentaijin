import { Gallery, GalleryDetail, GalleryListResponse, SearchParams } from '@/types/gallery';
import { config } from './config';

// Base API URL - update this to match your backend
const API_BASE = config.API_BASE_URL || 'http://localhost:3001';

// Error handling wrapper
async function apiRequest<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Get list of galleries
export async function fetchGalleries(params?: SearchParams): Promise<GalleryListResponse> {
  // If search term provided, use search endpoint
  if (params?.search) {
    return searchGalleries(params.search, params.page);
  }
  
  // Otherwise get all galleries (if your backend supports this)
  const searchParams = new URLSearchParams();
  if (params?.page) {
    searchParams.set('page', params.page.toString());
  }
  if (params?.limit) {
    searchParams.set('limit', params.limit.toString());
  }
  
  const url = `${API_BASE}/api/galleries${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  try {
    const response = await apiRequest<GalleryListResponse>(url);
    return response;
  } catch (error) {
    // Fallback to mock data for development
    console.warn('API failed, using mock data:', error);
    return getMockGalleries(params);
  }
}

// Get individual gallery metadata from MongoDB
export async function fetchGalleryDetail(id: string): Promise<GalleryDetail> {
  const url = `${API_BASE}/api/gallery/${id}`;
  
  try {
    const metadata = await apiRequest<Gallery>(url);
    
    // Generate image URLs based on totalImages count
    const images = Array.from({ length: metadata.totalImages }, (_, index) => 
      generateImageUrl(metadata.id, index + 1)
    );
    
    return {
      id: metadata.id,
      images
    };
  } catch (error) {
    // Fallback to mock data for development
    console.warn('API failed, using mock data:', error);
    return getMockGalleryDetail(id);
  }
}

// Search galleries using your backend endpoint
export async function searchGalleries(searchTerm: string, page = 1): Promise<GalleryListResponse> {
  const url = `${API_BASE}/api/search?q=${encodeURIComponent(searchTerm)}${page > 1 ? `&page=${page}` : ''}`;
  
  try {
    const response = await apiRequest<GalleryListResponse>(url);
    return response;
  } catch (error) {
    // Fallback to mock data for development
    console.warn('Search API failed, using mock data:', error);
    return getMockGalleries({ search: searchTerm, page });
  }
}

// Mock data fallbacks for development
function getMockGalleries(params?: SearchParams): GalleryListResponse {
  const mockGalleries: Gallery[] = [
    {
      id: "100",
      title: "Example Hentai Title 1",
      tags: ["big breasts", "blowjob", "schoolgirl"],
      language: "english",
      totalImages: 24,
      thumbnail: generateCoverUrl("100")
    },
    {
      id: "101", 
      title: "Another Gallery Title",
      tags: ["milf", "creampie", "office"],
      language: "japanese",
      totalImages: 18,
      thumbnail: generateCoverUrl("101")
    },
    {
      id: "102",
      title: "Third Example Gallery", 
      tags: ["yuri", "schoolgirl", "romance"],
      language: "english",
      totalImages: 32,
      thumbnail: generateCoverUrl("102")
    },
    {
      id: "103",
      title: "Fantasy Adventure Hentai",
      tags: ["fantasy", "elf", "adventure"],
      language: "korean", 
      totalImages: 28,
      thumbnail: generateCoverUrl("103")
    }
  ];

  // Simple search filter for mock data
  let filteredGalleries = mockGalleries;
  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filteredGalleries = mockGalleries.filter(gallery => 
      gallery.title.toLowerCase().includes(searchTerm) ||
      gallery.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  return {
    galleries: filteredGalleries,
    pagination: {
      currentPage: params?.page || 1,
      totalPages: Math.ceil(filteredGalleries.length / (params?.limit || 20)),
      totalItems: filteredGalleries.length,
      hasNext: (params?.page || 1) < Math.ceil(filteredGalleries.length / (params?.limit || 20)),
      hasPrev: (params?.page || 1) > 1,
    }
  };
}

function getMockGalleryDetail(id: string): GalleryDetail {
  // Generate mock image URLs for the gallery
  const mockImageCount = parseInt(id) % 30 + 10; // 10-40 images
  const images = Array.from({ length: mockImageCount }, (_, index) => 
    `https://via.placeholder.com/800x1200/${Math.abs(hashCode(id + index))}a/ffffff?text=Gallery+${id}+Page+${index + 1}`
  );

  return {
    id,
    images
  };
}

// Helper function for consistent hashing
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

// Utility to generate CDN image URL with zero-padding
export function generateImageUrl(galleryId: string, imageIndex: number, format = 'jpg'): string {
  const paddedIndex = imageIndex.toString().padStart(2, '0');
  return `${config.CDN_BASE_URL}/api/${galleryId}/${paddedIndex}.${format}`;
}

// Utility to generate CDN cover URL (first image)
export function generateCoverUrl(galleryId: string, format = 'jpg'): string {
  return `${config.CDN_BASE_URL}/api/${galleryId}/01.${format}`;
}
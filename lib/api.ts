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
  const searchParams = new URLSearchParams();
  
  if (params?.search) {
    searchParams.set('search', params.search);
  }
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

// Get individual gallery with full image list
export async function fetchGalleryDetail(id: string): Promise<GalleryDetail> {
  const url = `${API_BASE}/api/gallery/${id}`;
  
  try {
    const response = await apiRequest<GalleryDetail>(url);
    return response;
  } catch (error) {
    // Fallback to mock data for development
    console.warn('API failed, using mock data:', error);
    return getMockGalleryDetail(id);
  }
}

// Search galleries
export async function searchGalleries(searchTerm: string, page = 1): Promise<GalleryListResponse> {
  return fetchGalleries({ search: searchTerm, page });
}

// Mock data fallbacks for development
function getMockGalleries(params?: SearchParams): GalleryListResponse {
  const mockGalleries: Gallery[] = [
    {
      id: "12345",
      title: "Example Hentai Title 1",
      tags: ["big breasts", "blowjob", "schoolgirl"],
      language: "english",
      totalImages: 24,
      thumbnail: "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Gallery+12345"
    },
    {
      id: "12346",
      title: "Another Gallery Title",
      tags: ["milf", "creampie", "office"],
      language: "japanese",
      totalImages: 18,
      thumbnail: "https://via.placeholder.com/300x400/2a2a2a/ffffff?text=Gallery+12346"
    },
    {
      id: "12347",
      title: "Third Example Gallery",
      tags: ["yuri", "schoolgirl", "romance"],
      language: "english",
      totalImages: 32,
      thumbnail: "https://via.placeholder.com/300x400/3a3a3a/ffffff?text=Gallery+12347"
    },
    {
      id: "12348",
      title: "Fantasy Adventure Hentai",
      tags: ["fantasy", "elf", "adventure"],
      language: "korean",
      totalImages: 28,
      thumbnail: "https://via.placeholder.com/300x400/4a4a4a/ffffff?text=Gallery+12348"
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

// Utility to generate CDN image URL
export function generateImageUrl(galleryId: string, imageIndex: number, format = 'webp'): string {
  return `${config.CDN_BASE_URL}/${galleryId}/${imageIndex}.${format}`;
}

// Utility to generate CDN cover URL
export function generateCoverUrl(galleryId: string, format = 'webp'): string {
  return `${config.CDN_BASE_URL}/${galleryId}/cover.${format}`;
}
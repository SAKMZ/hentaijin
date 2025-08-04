import {
  Gallery,
  GalleryDetail,
  GalleryListResponse,
  SearchParams,
} from "@/types/gallery";
import { config } from "./config";
import { generateImageUrl, generateCoverUrl } from "./utils";

// Get list of galleries with filtering and sorting
export async function fetchGalleries(
  params?: SearchParams
): Promise<GalleryListResponse> {
  try {
    // Use Flask backend proxy API
    const response = await fetch("/api/galleries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params || {}),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Failed to fetch galleries from API, using fallback:", error);

    // Fallback to mock data
    const allGalleries = getMockGalleries();
    const page = params?.page || 1;
    const limit = params?.limit || config.GALLERIES_PER_PAGE;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGalleries = allGalleries.slice(startIndex, endIndex);

    return {
      galleries: paginatedGalleries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(allGalleries.length / limit),
        totalItems: allGalleries.length,
        hasNext: endIndex < allGalleries.length,
        hasPrev: page > 1,
      },
    };
  }
}

// Get individual gallery metadata from external API
export async function fetchGalleryDetail(
  hentai_id: string
): Promise<GalleryDetail> {
  try {
    // First try to get metadata from external API
    const metadataUrl = `${
      config.API_BASE_URL
    }${config.API_ENDPOINTS.GALLERY_METADATA.replace(
      "{hentai_id}",
      hentai_id
    )}`;
    const response = await fetch(metadataUrl);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const metadata = await response.json();

    // Generate image URLs based on pages count
    const images = Array.from({ length: metadata.pages }, (_, index) =>
      generateImageUrl(hentai_id, index + 1)
    );

    return {
      ...metadata,
      id: metadata.id || hentai_id,
      hentai_id: metadata.hentai_id || hentai_id,
      images,
      thumbnail: generateCoverUrl(hentai_id),
    };
  } catch (error) {
    console.warn(
      "Failed to fetch gallery detail from external API, using fallback:",
      error
    );
    return getMockGalleryDetail(hentai_id);
  }
}

// Search galleries - uses the same logic as fetchGalleries but with search term
export async function searchGalleries(
  searchTerm: string,
  page = 1,
  additionalParams?: Partial<SearchParams>
): Promise<GalleryListResponse> {
  return fetchGalleries({
    search: searchTerm,
    page,
    ...additionalParams,
  });
}

// Mock data fallbacks for development
function getMockGalleries(): Gallery[] {
  return [
    {
      id: "100001",
      hentai_id: "100001",
      title: "Example Doujinshi Title",
      characters: ["Sakura", "Hinata"],
      tags: ["big breasts", "schoolgirl", "vanilla"],
      artists: ["Artist Name"],
      categories: ["Doujinshi"],
      languages: ["english"],
      pages: 24,
      uploaded: Date.now() - 86400000, // 1 day ago
      thumbnail: generateCoverUrl("100001"),
      popularity: 1500,
      favorites: 230,
    },
    {
      id: "100002",
      hentai_id: "100002",
      title: "Another Gallery Example",
      characters: ["Tsunade", "Jiraiya"],
      tags: ["milf", "office", "netorare"],
      artists: ["Another Artist"],
      categories: ["Manga"],
      languages: ["japanese"],
      pages: 18,
      uploaded: Date.now() - 172800000, // 2 days ago
      thumbnail: generateCoverUrl("100002"),
      popularity: 2100,
      favorites: 350,
    },
    {
      id: "100003",
      hentai_id: "100003",
      title: "Third Gallery Sample",
      characters: ["Yuki", "Moe"],
      tags: ["yuri", "romance", "wholesome"],
      artists: ["Yuri Artist"],
      categories: ["Artist CG"],
      languages: ["english"],
      pages: 32,
      uploaded: Date.now() - 259200000, // 3 days ago
      thumbnail: generateCoverUrl("100003"),
      popularity: 890,
      favorites: 120,
    },
  ];
}

function getMockGalleryDetail(hentai_id: string): GalleryDetail {
  // Generate mock image URLs
  const mockImageCount = (parseInt(hentai_id) % 30) + 10; // 10-40 images
  const images = Array.from({ length: mockImageCount }, (_, index) =>
    generateImageUrl(hentai_id, index + 1)
  );

  return {
    id: hentai_id,
    hentai_id,
    title: `Mock Gallery ${hentai_id}`,
    characters: ["Mock Character A", "Mock Character B"],
    tags: ["sample", "mock", "test"],
    artists: ["Mock Artist"],
    categories: ["Doujinshi"],
    languages: ["english"],
    pages: mockImageCount,
    uploaded: Date.now() - Math.random() * 86400000 * 30, // Random within last 30 days
    images,
    popularity: Math.floor(Math.random() * 5000),
    favorites: Math.floor(Math.random() * 1000),
    description: `This is a mock gallery for testing purposes. Gallery ID: ${hentai_id}`,
    thumbnail: generateCoverUrl(hentai_id),
  };
}

// Get popular galleries (shortcut function)
export async function fetchPopularGalleries(
  page = 1
): Promise<GalleryListResponse> {
  return fetchGalleries({
    page,
    sort: config.SORT_OPTIONS.POPULAR,
  });
}

// Get new galleries (shortcut function)
export async function fetchNewGalleries(
  page = 1
): Promise<GalleryListResponse> {
  return fetchGalleries({
    page,
    sort: config.SORT_OPTIONS.NEW,
  });
}

// Get hot galleries (shortcut function)
export async function fetchHotGalleries(
  page = 1
): Promise<GalleryListResponse> {
  return fetchGalleries({
    page,
    sort: config.SORT_OPTIONS.HOT,
  });
}

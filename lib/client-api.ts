import {
  Gallery,
  GalleryDetail,
  GalleryListResponse,
  SearchParams,
} from "@/types/gallery";
import { config } from "./config";

// Get list of galleries with filtering and sorting
export async function fetchGalleries(
  params?: SearchParams
): Promise<GalleryListResponse> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sort) queryParams.append("sort", params.sort);
    if (params?.categories) {
      params.categories.forEach((cat) => queryParams.append("categories", cat));
    }
    if (params?.languages) {
      params.languages.forEach((lang) => queryParams.append("languages", lang));
    }
    if (params?.tags) {
      params.tags.forEach((tag) => queryParams.append("tags", tag));
    }

    const response = await fetch(`/api/galleries?${queryParams.toString()}`);

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

// Get individual gallery metadata and generate image URLs
export async function fetchGalleryDetail(
  hentai_id: string
): Promise<GalleryDetail> {
  try {
    const response = await fetch(`/api/galleries/${hentai_id}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Gallery not found: ${hentai_id}, using fallback`);
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
      return getMockGalleryDetail(hentai_id);
    }

    return await response.json();
  } catch (error) {
    console.warn(
      "Failed to fetch gallery detail from API, using fallback:",
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
      thumbnail: "https://cdn.hentaijin.com/100001/01.webp",
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
      thumbnail: "https://cdn.hentaijin.com/100002/01.webp",
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
      thumbnail: "https://cdn.hentaijin.com/100003/01.webp",
      popularity: 890,
      favorites: 120,
    },
  ];
}

function getMockGalleryDetail(hentai_id: string): GalleryDetail {
  // Generate mock image URLs
  const mockImageCount = (parseInt(hentai_id) % 30) + 10; // 10-40 images
  const images = Array.from({ length: mockImageCount }, (_, index) => {
    const indexStr = (index + 1).toString();
    const paddedIndex = indexStr.length === 1 ? "0" + indexStr : indexStr;
    return `https://cdn.hentaijin.com/${hentai_id}/${paddedIndex}.webp`;
  });

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

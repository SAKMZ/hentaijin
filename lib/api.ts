import {
  Gallery,
  GalleryDetail,
  GalleryListResponse,
  SearchParams,
} from "@/types/gallery";
import { config } from "./config";
import { connectToDatabase, initializeSampleData } from "./mongodb";

// Error handling wrapper
async function apiRequest<T>(url: string): Promise<T> {
  try {
    const fetchOptions: RequestInit = {
      headers: {
        Accept: "application/json",
      },
    };

    // Add Next.js caching if available
    if (typeof window === "undefined") {
      (fetchOptions as any).next = { revalidate: 300 };
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

// Fetch main database with all galleries from MongoDB
async function fetchAllGalleries(): Promise<Gallery[]> {
  try {
    const { collection } = await connectToDatabase();

    // Initialize sample data if collection is empty
    await initializeSampleData();

    const galleries = await collection.find({}).toArray();

    // Transform MongoDB documents to Gallery objects
    return galleries.map((gallery: any) => ({
      ...gallery,
      id: gallery._id?.toString() || gallery.id,
      hentai_id:
        gallery.hentai_id || gallery.id || gallery._id?.toString() || "",
      thumbnail:
        gallery.thumbnail ||
        `https://cdn.hentaijin.com/${gallery.hentai_id || gallery.id}/01.webp`,
    }));
  } catch (error) {
    console.warn(
      "Failed to fetch galleries from MongoDB, using fallback:",
      error
    );
    return getMockGalleries();
  }
}

// Get list of galleries with filtering and sorting
export async function fetchGalleries(
  params?: SearchParams
): Promise<GalleryListResponse> {
  const allGalleries = await fetchAllGalleries();
  let filteredGalleries = [...allGalleries];

  // Apply search filter
  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filteredGalleries = filteredGalleries.filter(
      (gallery) =>
        gallery.title.toLowerCase().includes(searchTerm) ||
        gallery.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        gallery.artists.some((artist) =>
          artist.toLowerCase().includes(searchTerm)
        ) ||
        gallery.categories.some((category) =>
          category.toLowerCase().includes(searchTerm)
        ) ||
        gallery.characters?.some((character) =>
          character.toLowerCase().includes(searchTerm)
        )
    );
  }

  // Apply category filter
  if (params?.categories && params.categories.length > 0) {
    filteredGalleries = filteredGalleries.filter((gallery) =>
      params.categories!.some(
        (category) => gallery.categories.indexOf(category) !== -1
      )
    );
  }

  // Apply language filter
  if (params?.languages && params.languages.length > 0) {
    filteredGalleries = filteredGalleries.filter((gallery) =>
      params.languages!.some(
        (language) => gallery.languages.indexOf(language) !== -1
      )
    );
  }

  // Apply tags filter
  if (params?.tags && params.tags.length > 0) {
    filteredGalleries = filteredGalleries.filter((gallery) =>
      params.tags!.some((tag) => gallery.tags.indexOf(tag) !== -1)
    );
  }

  // Apply sorting
  if (params?.sort) {
    switch (params.sort) {
      case config.SORT_OPTIONS.POPULAR:
        filteredGalleries.sort(
          (a, b) => (b.popularity || 0) - (a.popularity || 0)
        );
        break;
      case config.SORT_OPTIONS.NEW:
        filteredGalleries.sort((a, b) => b.uploaded - a.uploaded);
        break;
      case config.SORT_OPTIONS.HOT:
        // Hot = combination of recent + popular
        filteredGalleries.sort((a, b) => {
          const aScore =
            (a.popularity || 0) * 0.7 + (a.uploaded / 1000000) * 0.3;
          const bScore =
            (b.popularity || 0) * 0.7 + (b.uploaded / 1000000) * 0.3;
          return bScore - aScore;
        });
        break;
      case config.SORT_OPTIONS.DATE:
        filteredGalleries.sort((a, b) => b.uploaded - a.uploaded);
        break;
      case config.SORT_OPTIONS.ALPHABETICAL:
        filteredGalleries.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case config.SORT_OPTIONS.PAGES:
        filteredGalleries.sort((a, b) => b.pages - a.pages);
        break;
      default:
        // Default to newest first
        filteredGalleries.sort((a, b) => b.uploaded - a.uploaded);
    }
  } else {
    // Default sort: newest first
    filteredGalleries.sort((a, b) => b.uploaded - a.uploaded);
  }

  // Apply pagination
  const page = params?.page || 1;
  const limit = params?.limit || config.GALLERIES_PER_PAGE;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedGalleries = filteredGalleries.slice(startIndex, endIndex);

  return {
    galleries: paginatedGalleries,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredGalleries.length / limit),
      totalItems: filteredGalleries.length,
      hasNext: endIndex < filteredGalleries.length,
      hasPrev: page > 1,
    },
  };
}

// Get individual gallery metadata and generate image URLs
export async function fetchGalleryDetail(
  hentai_id: string
): Promise<GalleryDetail> {
  try {
    const { collection } = await connectToDatabase();
    const gallery = await collection.findOne({
      $or: [
        { hentai_id: hentai_id },
        { id: hentai_id },
        { _id: hentai_id as any },
      ],
    });

    if (!gallery) {
      console.warn(`Gallery not found: ${hentai_id}, using fallback`);
      return getMockGalleryDetail(hentai_id);
    }

    // Generate image URLs based on pages count
    const images = Array.from({ length: gallery.pages }, (_, index) =>
      generateImageUrl(gallery.hentai_id || gallery.id, index + 1)
    );

    return {
      ...gallery,
      id: gallery._id?.toString() || gallery.id,
      hentai_id:
        gallery.hentai_id || gallery.id || gallery._id?.toString() || "",
      images,
    };
  } catch (error) {
    console.warn(
      "Failed to fetch gallery metadata from MongoDB, using fallback:",
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

// Utility to generate CDN image URL with zero-padding
export function generateImageUrl(
  hentai_id: string,
  imageIndex: number,
  format = config.IMAGES.FORMAT
): string {
  const indexStr = imageIndex.toString();
  const paddedIndex = indexStr.length === 1 ? "0" + indexStr : indexStr;
  const endpoint = config.CDN_ENDPOINTS.GALLERY_IMAGE.replace(
    "{hentai_id}",
    hentai_id
  ).replace("{paddedIndex}", paddedIndex);
  return `${config.CDN_BASE_URL}${endpoint}`;
}

// Utility to generate CDN cover URL (first image)
export function generateCoverUrl(
  hentai_id: string,
  format = config.IMAGES.THUMBNAIL_FORMAT
): string {
  const endpoint = config.CDN_ENDPOINTS.GALLERY_COVER.replace(
    "{hentai_id}",
    hentai_id
  );
  return `${config.CDN_BASE_URL}${endpoint}`;
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
  };
}

// Utility function to format upload date
export function formatUploadDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
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

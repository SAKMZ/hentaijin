// Get environment variables safely
const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    return (
      (typeof window === "undefined" &&
        typeof global !== "undefined" &&
        (global as any).process?.env?.[key]) ||
      defaultValue
    );
  } catch {
    return defaultValue;
  }
};

export const config = {
  // API Configuration
  API_BASE_URL: getEnvVar(
    "NEXT_PUBLIC_API_BASE_URL",
    "https://api.hentaijin.com"
  ),
  CDN_BASE_URL: getEnvVar(
    "NEXT_PUBLIC_CDN_BASE_URL",
    "https://cdn.hentaijin.com"
  ),
  DOMAIN_URL: getEnvVar("NEXT_PUBLIC_DOMAIN_URL", "https://hentaijin.com"),

  SITE_NAME: "hentaijin",
  SITE_DESCRIPTION:
    "Modern hentai gallery site - Browse thousands of doujinshi and manga",
  GALLERIES_PER_PAGE: 25,

  // API Endpoints
  API_ENDPOINTS: {
    // Individual gallery metadata
    GALLERY_METADATA: "/{hentai_id}/metadata",
    // Search galleries
    SEARCH: "/search",
    // Browse by category, tag, artist, etc.
    BROWSE: "/browse",
  },

  // CDN Endpoints
  CDN_ENDPOINTS: {
    // Individual gallery images
    GALLERY_IMAGE: "/{hentai_id}/image",
    // Individual gallery by ID
    GALLERY: "/{hentai_id}",
  },

  // Image configuration
  IMAGES: {
    FORMAT: "webp" as const,
    THUMBNAIL_FORMAT: "webp" as const,
  },

  // Sorting options similar to nhentai
  SORT_OPTIONS: {
    POPULAR: "popular",
    NEW: "new",
    HOT: "hot",
    DATE: "date",
    ALPHABETICAL: "alphabetical",
    PAGES: "pages",
  },

  // Filter categories
  CATEGORIES: [
    "Doujinshi",
    "Manga",
    "Artist CG",
    "Game CG",
    "Western",
    "Non-H",
    "Image Set",
    "Cosplay",
    "Asian Porn",
    "Misc",
  ],

  LANGUAGES: [
    "japanese",
    "english",
    "chinese",
    "korean",
    "spanish",
    "french",
    "german",
    "russian",
    "other",
  ],

  // Fallback URLs
  FALLBACK_URLS: {
    ERROR: "https://cdn.hentaijin.com/placeholder/error.webp",
    LOADING: "https://cdn.hentaijin.com/placeholder/loading.webp",
  },
} as const;

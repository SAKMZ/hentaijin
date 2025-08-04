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
  // CDN Configuration
  CDN_BASE_URL: getEnvVar(
    "NEXT_PUBLIC_CDN_BASE_URL",
    "https://cdn.hentaijin.com"
  ),
  DOMAIN_URL: getEnvVar("NEXT_PUBLIC_DOMAIN_URL", "https://hentaijin.com"),

  SITE_NAME: "hentaijin",
  SITE_DESCRIPTION:
    "Modern hentai gallery site - Browse thousands of doujinshi and manga",
  GALLERIES_PER_PAGE: 25,

  // CDN Endpoints
  CDN_ENDPOINTS: {
    // Main database with all galleries metadata
    DB_JSON: "/db.json",
    // Individual gallery images
    GALLERY_IMAGE: "/{hentai_id}/{paddedIndex}.webp",
    // Individual gallery cover (first image)
    GALLERY_COVER: "/{hentai_id}/01.webp",
    // Individual gallery metadata
    GALLERY_METADATA: "/{hentai_id}/metadata.json",
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

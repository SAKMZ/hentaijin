export const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://128.140.78.75:3000",
  CDN_BASE_URL: process.env.NEXT_PUBLIC_CDN_BASE_URL || "http://128.140.78.75",
  SITE_NAME: "hentaijin",
  SITE_DESCRIPTION: "Modern hentai gallery site",
  GALLERIES_PER_PAGE: 20,
  TAGS: {
    LANGUAGE: ["English", "Japanese", "Chinese", "Korean"],
    CATEGORIES: ["Manga", "Doujinshi", "CG Set", "Game CG", "Artbook"],
  },

  // Image configuration
  IMAGES: {
    FORMAT: "jpg" as const,
  },

  // CDN URL structure - http://128.140.78.75/api/100/01.jpg
  CDN_ENDPOINTS: {
    GALLERY_IMAGE: "/api/{galleryId}/{paddedIndex}.{format}",
    GALLERY_COVER: "/api/{galleryId}/01.{format}", // First image as cover
  },

    // Fallback URLs - use your own server instead of external placeholders
  FALLBACK_URLS: {
    ERROR: "http://128.140.78.75:3000/api/100/01.jpg",
  },
} as const;

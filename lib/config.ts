export const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  CDN_BASE_URL: process.env.NEXT_PUBLIC_CDN_BASE_URL || "https://cdn.example.com",
  SITE_NAME: "Hetaijin",
  SITE_DESCRIPTION: "Modern hentai gallery site",
  GALLERIES_PER_PAGE: 20,
  TAGS: {
    LANGUAGE: ["English", "Japanese", "Chinese", "Korean"],
    CATEGORIES: ["Manga", "Doujinshi", "CG Set", "Game CG", "Artbook"],
  },
} as const;

// Helper function to get gallery ZIP URL
export const getGalleryZipUrl = (id: string): string => {
  return `${config.CDN_BASE_URL}/galleries/${id}.zip`;
};

// Helper function to get thumbnail URL
export const getThumbnailUrl = (id: string): string => {
  return `${config.CDN_BASE_URL}/thumbnails/${id}.webp`;
};

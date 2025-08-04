export const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  CDN_BASE_URL:
    process.env.NEXT_PUBLIC_CDN_BASE_URL || "https://via.placeholder.com",
  SITE_NAME: "Hetaijin",
  SITE_DESCRIPTION: "Modern hentai gallery site",
  GALLERIES_PER_PAGE: 20,
  TAGS: {
    LANGUAGE: ["English", "Japanese", "Chinese", "Korean"],
    CATEGORIES: ["Manga", "Doujinshi", "CG Set", "Game CG", "Artbook"],
  },
} as const;

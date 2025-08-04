export const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  CDN_BASE_URL: process.env.NEXT_PUBLIC_CDN_BASE_URL || "https://cdn.hetaijin.com",
  SITE_NAME: "Hetaijin",
  SITE_DESCRIPTION: "Modern hentai gallery site",
  GALLERIES_PER_PAGE: 20,
  TAGS: {
    LANGUAGE: ["English", "Japanese", "Chinese", "Korean"],
    CATEGORIES: ["Manga", "Doujinshi", "CG Set", "Game CG", "Artbook"],
  },
  
  // New CDN and image configuration
  IMAGES: {
    FORMAT: 'webp' as const,
    QUALITY: 85,
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // ms
    PRELOAD_BUFFER: 2, // Preload next N images
    LAZY_LOAD_THRESHOLD: '200px',
    PLACEHOLDER_COLOR: '#1a1a1a',
  },
  
  // Tokenized URL structure
  CDN_ENDPOINTS: {
    // Pattern: https://cdn.mysite.com/images/[gallery_id]/[token]/[image_index].webp
    GALLERY_IMAGE: '/images/{galleryId}/{token}/{imageIndex}.{format}',
    GALLERY_COVER: '/covers/{galleryId}/{token}/cover.{format}',
    GALLERY_THUMBNAIL: '/thumbs/{galleryId}/{token}/{imageIndex}.{format}',
  },
  
  // Fallback URLs for development/testing
  FALLBACK_URLS: {
    PLACEHOLDER: 'https://via.placeholder.com/800x1200/1a1a1a/ffffff?text=Loading...',
    ERROR: 'https://via.placeholder.com/800x1200/2a2a2a/ff6b6b?text=Image+Error',
    COVER_PLACEHOLDER: 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Cover',
  },
} as const;

import { Gallery } from "@/types/gallery";
import { generateDummyToken, generateCoverUrl } from "./utils";

export const mockGalleries: Gallery[] = [
  {
    id: "1",
    title: "Sample Gallery 1",
    artist: "Artist Name 1",
    language: "English",
    tags: ["tag1", "tag2", "original"],
    category: "Manga",
    coverImage: generateCoverUrl("1", generateDummyToken("1")),
    totalPages: 20,
    uploadDate: "2024-01-15",
    views: 1234,
    token: generateDummyToken("1"),
    imageFormat: "webp",
  },
  {
    id: "2",
    title: "Sample Gallery 2",
    artist: "Artist Name 2",
    language: "Japanese",
    tags: ["tag2", "tag3", "schoolgirl"],
    category: "Doujinshi",
    coverImage: generateCoverUrl("2", generateDummyToken("2")),
    totalPages: 15,
    uploadDate: "2024-01-14",
    views: 2345,
    token: generateDummyToken("2"),
    imageFormat: "webp",
  },
  {
    id: "3",
    title: "Sample Gallery 3",
    artist: "Artist Name 3",
    language: "Chinese",
    tags: ["tag1", "tag4", "milf"],
    category: "CG Set",
    coverImage: generateCoverUrl("3", generateDummyToken("3")),
    totalPages: 25,
    uploadDate: "2024-01-13",
    views: 3456,
    token: generateDummyToken("3"),
    imageFormat: "webp",
  },
  {
    id: "4",
    title: "Sample Gallery 4",
    artist: "Artist Name 4",
    language: "Korean",
    tags: ["tag3", "tag5", "fantasy"],
    category: "Game CG",
    coverImage: generateCoverUrl("4", generateDummyToken("4")),
    totalPages: 30,
    uploadDate: "2024-01-12",
    views: 4567,
    token: generateDummyToken("4"),
    imageFormat: "webp",
  },
];

// Generate more mock data for pagination testing
export const generateMockGalleries = (count: number): Gallery[] => {
  const galleries: Gallery[] = [];

  for (let i = 1; i <= count; i++) {
    const galleryId = i.toString();
    const token = generateDummyToken(galleryId);
    
    galleries.push({
      id: galleryId,
      title: `Sample Gallery ${i}`,
      artist: `Artist Name ${(i % 10) + 1}`,
      language: ["English", "Japanese", "Chinese", "Korean"][i % 4],
      tags: [`tag${(i % 5) + 1}`, `tag${((i + 1) % 5) + 1}`, "sample"],
      category: ["Manga", "Doujinshi", "CG Set", "Game CG", "Artbook"][i % 5],
      coverImage: generateCoverUrl(galleryId, token),
      totalPages: (i % 20) + 10,
      uploadDate: new Date(2024, 0, Math.max(1, 20 - (i % 20)))
        .toISOString()
        .split("T")[0],
      views: Math.floor(Math.random() * 10000) + 100,
      token,
      imageFormat: "webp",
    });
  }

  return galleries;
};

// Helper function to generate image URLs for a gallery
export const generateGalleryImageUrls = (gallery: Gallery): string[] => {
  if (!gallery.token) return [];
  
  return Array.from({ length: gallery.totalPages }, (_, index) => {
    return `${process.env.NODE_ENV === 'development' 
      ? `https://via.placeholder.com/800x1200/${Math.abs(hashCode(gallery.id + index))}a/ffffff?text=Gallery+${gallery.id}+Page+${index + 1}`
      : `https://cdn.hetaijin.com/images/${gallery.id}/${gallery.token}/${index}.webp`
    }`;
  });
};

// Helper function to create consistent hashes (same as in utils.ts)
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

import { Gallery } from "@/types/gallery";

export const mockGalleries: Gallery[] = [
  {
    id: "1",
    title: "Sample Gallery 1",
    artist: "Artist Name 1",
    language: "English",
    tags: ["tag1", "tag2", "original"],
    category: "Manga",
    coverImage:
      "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Gallery+1",
    images: Array.from(
      { length: 20 },
      (_, i) =>
        `https://via.placeholder.com/800x1200/1a1a1a/ffffff?text=Page+${i + 1}`
    ),
    totalPages: 20,
    uploadDate: "2024-01-15",
    views: 1234,
  },
  {
    id: "2",
    title: "Sample Gallery 2",
    artist: "Artist Name 2",
    language: "Japanese",
    tags: ["tag2", "tag3", "schoolgirl"],
    category: "Doujinshi",
    coverImage:
      "https://via.placeholder.com/300x400/2a2a2a/ffffff?text=Gallery+2",
    images: Array.from(
      { length: 15 },
      (_, i) =>
        `https://via.placeholder.com/800x1200/2a2a2a/ffffff?text=Page+${i + 1}`
    ),
    totalPages: 15,
    uploadDate: "2024-01-14",
    views: 2345,
  },
  {
    id: "3",
    title: "Sample Gallery 3",
    artist: "Artist Name 3",
    language: "Chinese",
    tags: ["tag1", "tag4", "milf"],
    category: "CG Set",
    coverImage:
      "https://via.placeholder.com/300x400/3a3a3a/ffffff?text=Gallery+3",
    images: Array.from(
      { length: 25 },
      (_, i) =>
        `https://via.placeholder.com/800x1200/3a3a3a/ffffff?text=Page+${i + 1}`
    ),
    totalPages: 25,
    uploadDate: "2024-01-13",
    views: 3456,
  },
  {
    id: "4",
    title: "Sample Gallery 4",
    artist: "Artist Name 4",
    language: "Korean",
    tags: ["tag3", "tag5", "fantasy"],
    category: "Game CG",
    coverImage:
      "https://via.placeholder.com/300x400/4a4a4a/ffffff?text=Gallery+4",
    images: Array.from(
      { length: 30 },
      (_, i) =>
        `https://via.placeholder.com/800x1200/4a4a4a/ffffff?text=Page+${i + 1}`
    ),
    totalPages: 30,
    uploadDate: "2024-01-12",
    views: 4567,
  },
];

// Generate more mock data for pagination testing
export const generateMockGalleries = (count: number): Gallery[] => {
  const galleries: Gallery[] = [];

  for (let i = 1; i <= count; i++) {
    galleries.push({
      id: i.toString(),
      title: `Sample Gallery ${i}`,
      artist: `Artist Name ${(i % 10) + 1}`,
      language: ["English", "Japanese", "Chinese", "Korean"][i % 4],
      tags: [`tag${(i % 5) + 1}`, `tag${((i + 1) % 5) + 1}`, "sample"],
      category: ["Manga", "Doujinshi", "CG Set", "Game CG", "Artbook"][i % 5],
      coverImage: `https://via.placeholder.com/300x400/${i % 9}a${i % 9}a${
        i % 9
      }a/ffffff?text=Gallery+${i}`,
      images: Array.from(
        { length: (i % 20) + 10 },
        (_, j) =>
          `https://via.placeholder.com/800x1200/${i % 9}a${i % 9}a${
            i % 9
          }a/ffffff?text=Page+${j + 1}`
      ),
      totalPages: (i % 20) + 10,
      uploadDate: new Date(2024, 0, Math.max(1, 20 - (i % 20)))
        .toISOString()
        .split("T")[0],
      views: Math.floor(Math.random() * 10000) + 100,
    });
  }

  return galleries;
};

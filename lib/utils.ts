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

// Utility to generate CDN image URL
export function generateImageUrl(
  hentai_id: string,
  imageIndex: number
): string {
  return `https://cdn.hentaijin.com/${hentai_id}/image?page=${imageIndex}`;
}

// Utility to generate CDN cover URL (first image)
export function generateCoverUrl(hentai_id: string): string {
  return `https://cdn.hentaijin.com/${hentai_id}/image?page=1`;
}

// Utility to generate gallery CDN URL
export function generateGalleryUrl(hentai_id: string): string {
  return `https://cdn.hentaijin.com/${hentai_id}`;
}

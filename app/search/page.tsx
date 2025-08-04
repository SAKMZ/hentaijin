import { Suspense } from "react";
import { Metadata } from "next/head";
import { SearchBar } from "@/components/SearchBar";
import { GalleryCard } from "@/components/GalleryCard";
import { Pagination } from "@/components/ui/Pagination";
import { GalleryGridSkeleton } from "@/components/ui/SkeletonLoader";
import { generateMockGalleries } from "@/lib/mockData";
import { config } from "@/lib/config";
import { SearchResponse, SearchFilters } from "@/types/gallery";

export const metadata: Metadata = {
  title: "Search",
  description: "Search hentai galleries by title, artist, tags, and more",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
    language?: string;
    category?: string;
    artist?: string;
  };
}

// Mock API call function
async function searchGalleries(
  filters: SearchFilters,
  page: number = 1
): Promise<SearchResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let galleries = generateMockGalleries(200);

  // Apply filters
  if (filters.query) {
    const query = filters.query.toLowerCase();
    galleries = galleries.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        g.artist.toLowerCase().includes(query) ||
        g.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (filters.language) {
    galleries = galleries.filter((g) => g.language === filters.language);
  }

  if (filters.category) {
    galleries = galleries.filter((g) => g.category === filters.category);
  }

  if (filters.artist) {
    galleries = galleries.filter((g) =>
      g.artist.toLowerCase().includes(filters.artist!.toLowerCase())
    );
  }

  // Pagination
  const startIndex = (page - 1) * config.GALLERIES_PER_PAGE;
  const endIndex = startIndex + config.GALLERIES_PER_PAGE;
  const paginatedGalleries = galleries.slice(startIndex, endIndex);

  return {
    galleries: paginatedGalleries,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(galleries.length / config.GALLERIES_PER_PAGE),
      totalItems: galleries.length,
      hasNext: endIndex < galleries.length,
      hasPrev: page > 1,
    },
    filters,
  };
}

async function SearchResults({
  filters,
  page,
}: {
  filters: SearchFilters;
  page: number;
}) {
  const { galleries, pagination } = await searchGalleries(filters, page);

  if (galleries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No galleries found
        </h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search filters or search terms
        </p>
        <div className="text-sm text-muted-foreground">
          {filters.query && <div>Query: "{filters.query}"</div>}
          {filters.language && <div>Language: {filters.language}</div>}
          {filters.category && <div>Category: {filters.category}</div>}
          {filters.artist && <div>Artist: {filters.artist}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Search Results</h2>
          <p className="text-muted-foreground">
            Found {pagination.totalItems} galleries
            {filters.query && ` for "${filters.query}"`}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      </div>

      {/* Active Filters */}
      {(filters.query ||
        filters.language ||
        filters.category ||
        filters.artist) && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.query && (
            <span className="inline-flex items-center px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
              Query: {filters.query}
            </span>
          )}
          {filters.language && (
            <span className="inline-flex items-center px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
              Language: {filters.language}
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
              Category: {filters.category}
            </span>
          )}
          {filters.artist && (
            <span className="inline-flex items-center px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
              Artist: {filters.artist}
            </span>
          )}
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {galleries.map((gallery) => (
          <GalleryCard key={gallery.id} gallery={gallery} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        baseUrl="/search"
        searchParams={
          new URLSearchParams({
            ...(filters.query && { q: filters.query }),
            ...(filters.language && { language: filters.language }),
            ...(filters.category && { category: filters.category }),
            ...(filters.artist && { artist: filters.artist }),
            page: page.toString(),
          })
        }
      />
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const filters: SearchFilters = {
    query: searchParams.q || undefined,
    language: searchParams.language || undefined,
    category: searchParams.category || undefined,
    artist: searchParams.artist || undefined,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Search <span className="text-primary">Galleries</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find your favorite hentai galleries by title, artist, tags, and more
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar initialFilters={filters} />

      {/* Search Results */}
      <Suspense fallback={<GalleryGridSkeleton />}>
        <SearchResults filters={filters} page={page} />
      </Suspense>
    </div>
  );
}

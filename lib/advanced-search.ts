import { SearchParams } from "@/types/gallery";

// Advanced search interface
export interface AdvancedSearchParams extends SearchParams {
  // Content filters
  includeAny?: string[]; // Include any of these tags
  includeAll?: string[]; // Include all of these tags
  exclude?: string[]; // Exclude these tags

  // Metadata filters
  minPages?: number;
  maxPages?: number;
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string

  // Rating/popularity filters
  minRating?: number;
  maxRating?: number;
  minFavorites?: number;

  // Content type filters
  hasImages?: boolean;
  hasText?: boolean;

  // Language preferences
  preferredLanguages?: string[];

  // Advanced sorting
  sortBy?:
    | "title"
    | "uploaded"
    | "pages"
    | "popularity"
    | "favorites"
    | "rating";
  sortOrder?: "asc" | "desc";

  // Search mode
  searchMode?: "simple" | "advanced" | "fuzzy";

  // Result preferences
  includeMetadata?: boolean;
  includeThumbnails?: boolean;
}

// Advanced search operators
export const SEARCH_OPERATORS = {
  AND: "&&",
  OR: "||",
  NOT: "!",
  EXACT: '"',
  WILDCARD: "*",
  REGEX: "/",
} as const;

// Parse advanced search query
export function parseAdvancedSearchQuery(query: string): AdvancedSearchParams {
  const params: AdvancedSearchParams = {};

  // Split query into parts
  const parts = query.split(" ");
  const includeAny: string[] = [];
  const includeAll: string[] = [];
  const exclude: string[] = [];

  for (const part of parts) {
    if (part.startsWith("!")) {
      // Exclude
      exclude.push(part.substring(1));
    } else if (part.startsWith('"') && part.endsWith('"')) {
      // Exact match - include all
      includeAll.push(part.slice(1, -1));
    } else if (part.includes("||")) {
      // OR operator - include any
      includeAny.push(...part.split("||"));
    } else if (part.includes("&&")) {
      // AND operator - include all
      includeAll.push(...part.split("&&"));
    } else if (part.includes(":")) {
      // Field-specific search
      const [field, value] = part.split(":");

      switch (field.toLowerCase()) {
        case "pages":
          if (value.includes("-")) {
            const [min, max] = value.split("-").map(Number);
            params.minPages = min;
            params.maxPages = max;
          } else if (value.startsWith(">=")) {
            params.minPages = Number(value.substring(2));
          } else if (value.startsWith("<=")) {
            params.maxPages = Number(value.substring(2));
          } else {
            params.minPages = Number(value);
            params.maxPages = Number(value);
          }
          break;

        case "date":
          if (value.includes("-")) {
            const [from, to] = value.split("-");
            params.dateFrom = from;
            params.dateTo = to;
          }
          break;

        case "category":
          params.categories = [value];
          break;

        case "artist":
          params.artists = [value];
          break;

        case "language":
          params.languages = [value];
          break;

        case "rating":
          if (value.includes("-")) {
            const [min, max] = value.split("-").map(Number);
            params.minRating = min;
            params.maxRating = max;
          } else {
            params.minRating = Number(value);
          }
          break;

        case "favorites":
          if (value.startsWith(">=")) {
            params.minFavorites = Number(value.substring(2));
          } else {
            params.minFavorites = Number(value);
          }
          break;
      }
    } else {
      // Regular search term
      includeAny.push(part);
    }
  }

  // Set arrays only if they have content
  if (includeAny.length > 0) params.includeAny = includeAny;
  if (includeAll.length > 0) params.includeAll = includeAll;
  if (exclude.length > 0) params.exclude = exclude;

  return params;
}

// Build search query string from advanced params
export function buildAdvancedSearchQuery(params: AdvancedSearchParams): string {
  const queryParts: string[] = [];

  // Include any tags (OR)
  if (params.includeAny?.length) {
    queryParts.push(params.includeAny.join(" || "));
  }

  // Include all tags (AND)
  if (params.includeAll?.length) {
    queryParts.push(params.includeAll.map((tag) => `"${tag}"`).join(" && "));
  }

  // Exclude tags
  if (params.exclude?.length) {
    queryParts.push(params.exclude.map((tag) => `!${tag}`).join(" "));
  }

  // Page filters
  if (params.minPages && params.maxPages) {
    queryParts.push(`pages:${params.minPages}-${params.maxPages}`);
  } else if (params.minPages) {
    queryParts.push(`pages:>=${params.minPages}`);
  } else if (params.maxPages) {
    queryParts.push(`pages:<=${params.maxPages}`);
  }

  // Date filters
  if (params.dateFrom && params.dateTo) {
    queryParts.push(`date:${params.dateFrom}-${params.dateTo}`);
  }

  // Category filter
  if (params.categories?.length) {
    queryParts.push(`category:${params.categories[0]}`);
  }

  // Artist filter
  if (params.artists?.length) {
    queryParts.push(`artist:${params.artists[0]}`);
  }

  // Language filter
  if (params.languages?.length) {
    queryParts.push(`language:${params.languages[0]}`);
  }

  // Rating filter
  if (params.minRating && params.maxRating) {
    queryParts.push(`rating:${params.minRating}-${params.maxRating}`);
  } else if (params.minRating) {
    queryParts.push(`rating:>=${params.minRating}`);
  }

  // Favorites filter
  if (params.minFavorites) {
    queryParts.push(`favorites:>=${params.minFavorites}`);
  }

  return queryParts.join(" ");
}

// Validate advanced search parameters
export function validateAdvancedSearchParams(
  params: AdvancedSearchParams
): string[] {
  const errors: string[] = [];

  // Page validation
  if (params.minPages && params.minPages < 1) {
    errors.push("Minimum pages must be at least 1");
  }

  if (params.maxPages && params.maxPages < 1) {
    errors.push("Maximum pages must be at least 1");
  }

  if (params.minPages && params.maxPages && params.minPages > params.maxPages) {
    errors.push("Minimum pages cannot be greater than maximum pages");
  }

  // Rating validation
  if (params.minRating && (params.minRating < 1 || params.minRating > 10)) {
    errors.push("Rating must be between 1 and 10");
  }

  if (params.maxRating && (params.maxRating < 1 || params.maxRating > 10)) {
    errors.push("Rating must be between 1 and 10");
  }

  if (
    params.minRating &&
    params.maxRating &&
    params.minRating > params.maxRating
  ) {
    errors.push("Minimum rating cannot be greater than maximum rating");
  }

  // Favorites validation
  if (params.minFavorites && params.minFavorites < 0) {
    errors.push("Minimum favorites cannot be negative");
  }

  // Date validation
  if (params.dateFrom && params.dateTo) {
    const fromDate = new Date(params.dateFrom);
    const toDate = new Date(params.dateTo);

    if (fromDate > toDate) {
      errors.push("From date cannot be after to date");
    }
  }

  return errors;
}

// Get search suggestions based on partial query
export function getSearchSuggestions(partialQuery: string): string[] {
  const suggestions: string[] = [];

  // Common tag suggestions
  const commonTags = [
    "vanilla",
    "netorare",
    "yuri",
    "yaoi",
    "big breasts",
    "small breasts",
    "schoolgirl",
    "milf",
    "tentacles",
    "bondage",
    "romance",
    "comedy",
    "drama",
    "fantasy",
    "sci-fi",
    "historical",
    "modern",
    "supernatural",
  ];

  // Common categories
  const commonCategories = [
    "Doujinshi",
    "Manga",
    "Artist CG",
    "Game CG",
    "Western",
    "Image Set",
  ];

  // Common languages
  const commonLanguages = [
    "english",
    "japanese",
    "chinese",
    "korean",
    "spanish",
    "french",
  ];

  const query = partialQuery.toLowerCase();

  // Tag suggestions
  commonTags.forEach((tag) => {
    if (tag.includes(query)) {
      suggestions.push(tag);
    }
  });

  // Category suggestions
  commonCategories.forEach((category) => {
    if (category.toLowerCase().includes(query)) {
      suggestions.push(`category:${category}`);
    }
  });

  // Language suggestions
  commonLanguages.forEach((language) => {
    if (language.includes(query)) {
      suggestions.push(`language:${language}`);
    }
  });

  // Operator suggestions
  if (query.length === 0 || query.endsWith(" ")) {
    suggestions.push("pages:>=10", "rating:>=8", "favorites:>=100");
  }

  return suggestions.slice(0, 10); // Limit to 10 suggestions
}

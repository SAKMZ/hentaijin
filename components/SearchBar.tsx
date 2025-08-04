"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchFilters } from "@/types/gallery";
import { config } from "@/lib/config";

interface SearchBarProps {
  initialFilters?: SearchFilters;
  onSearch?: (filters: SearchFilters) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialFilters,
  onSearch,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(
    initialFilters?.query || searchParams.get("q") || ""
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    initialFilters?.language || searchParams.get("language") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialFilters?.category || searchParams.get("category") || ""
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const filters: SearchFilters = {
        query: query.trim() || undefined,
        language: selectedLanguage || undefined,
        category: selectedCategory || undefined,
      };

      if (onSearch) {
        onSearch(filters);
      } else {
        // Navigate to search page with filters
        const params = new URLSearchParams();
        if (filters.query) params.set("q", filters.query);
        if (filters.language) params.set("language", filters.language);
        if (filters.category) params.set("category", filters.category);

        router.push(`/search?${params.toString()}`);
      }
    },
    [query, selectedLanguage, selectedCategory, onSearch, router]
  );

  const clearFilters = useCallback(() => {
    setQuery("");
    setSelectedLanguage("");
    setSelectedCategory("");

    if (onSearch) {
      onSearch({});
    } else {
      router.push("/search");
    }
  }, [onSearch, router]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search galleries, tags, artists..."
            className="w-full px-4 py-3 text-foreground bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Search
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4">
          {/* Language Filter */}
          <div className="flex-1 min-w-32">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Language
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 text-sm text-foreground bg-card border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">All Languages</option>
              {config.TAGS.LANGUAGE.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex-1 min-w-32">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm text-foreground bg-card border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">All Categories</option>
              {config.TAGS.CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

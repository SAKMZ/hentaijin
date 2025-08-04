"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AdvancedSearchParams,
  parseAdvancedSearchQuery,
  buildAdvancedSearchQuery,
  validateAdvancedSearchParams,
} from "@/lib/advanced-search";

interface AdvancedSearchProps {
  initialQuery?: string;
  onClose?: () => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  initialQuery = "",
  onClose,
}) => {
  const router = useRouter();
  const [params, setParams] = useState<AdvancedSearchParams>(() =>
    parseAdvancedSearchQuery(initialQuery)
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate parameters
    const validationErrors = validateAdvancedSearchParams(params);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Build search query
    const searchQuery = buildAdvancedSearchQuery(params);

    // Navigate to search page
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set("search", searchQuery);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.sortBy) searchParams.set("sort", params.sortBy);

    router.push(`/search?${searchParams.toString()}`);

    if (onClose) onClose();
  };

  const handleReset = () => {
    setParams({});
    setErrors([]);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-600 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Validation Errors:</h3>
          <ul className="list-disc list-inside text-white">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Include Any Tags
            </label>
            <input
              type="text"
              value={params.includeAny?.join(", ") || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  includeAny: e.target.value
                    ? e.target.value.split(",").map((s) => s.trim())
                    : undefined,
                }))
              }
              placeholder="tag1, tag2, tag3..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Show galleries with any of these tags
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Include All Tags
            </label>
            <input
              type="text"
              value={params.includeAll?.join(", ") || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  includeAll: e.target.value
                    ? e.target.value.split(",").map((s) => s.trim())
                    : undefined,
                }))
              }
              placeholder="tag1, tag2, tag3..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Show galleries with all of these tags
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Exclude Tags
            </label>
            <input
              type="text"
              value={params.exclude?.join(", ") || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  exclude: e.target.value
                    ? e.target.value.split(",").map((s) => s.trim())
                    : undefined,
                }))
              }
              placeholder="tag1, tag2, tag3..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Hide galleries with these tags
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artists
            </label>
            <input
              type="text"
              value={params.artists?.join(", ") || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  artists: e.target.value
                    ? e.target.value.split(",").map((s) => s.trim())
                    : undefined,
                }))
              }
              placeholder="artist1, artist2..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categories
            </label>
            <select
              value={params.categories?.[0] || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  categories: e.target.value ? [e.target.value] : undefined,
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
            >
              <option value="">Any Category</option>
              <option value="Doujinshi">Doujinshi</option>
              <option value="Manga">Manga</option>
              <option value="Artist CG">Artist CG</option>
              <option value="Game CG">Game CG</option>
              <option value="Western">Western</option>
              <option value="Image Set">Image Set</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Languages
            </label>
            <select
              value={params.languages?.[0] || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  languages: e.target.value ? [e.target.value] : undefined,
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
            >
              <option value="">Any Language</option>
              <option value="english">English</option>
              <option value="japanese">Japanese</option>
              <option value="chinese">Chinese</option>
              <option value="korean">Korean</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={params.sortBy || "uploaded"}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  sortBy: e.target.value,
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
            >
              <option value="uploaded">Upload Date</option>
              <option value="title">Title</option>
              <option value="pages">Page Count</option>
              <option value="popularity">Popularity</option>
              <option value="favorites">Favorites</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Page Count
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={params.minPages || ""}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    minPages: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
                placeholder="Min"
                min="1"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
              />
              <span className="text-gray-400 self-center">-</span>
              <input
                type="number"
                value={params.maxPages || ""}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    maxPages: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
                placeholder="Max"
                min="1"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={params.minRating || ""}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    minRating: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  }))
                }
                placeholder="Min"
                min="1"
                max="10"
                step="0.1"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
              />
              <span className="text-gray-400 self-center">-</span>
              <input
                type="number"
                value={params.maxRating || ""}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    maxRating: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  }))
                }
                placeholder="Max"
                min="1"
                max="10"
                step="0.1"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min Favorites
            </label>
            <input
              type="number"
              value={params.minFavorites || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  minFavorites: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                }))
              }
              placeholder="Min favorites"
              min="0"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-pink-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

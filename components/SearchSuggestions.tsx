"use client";

import { useState, useEffect, useRef } from "react";

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionClick,
  isVisible,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query || query.length < 2 || !isVisible) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(query)}`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.warn("Failed to fetch suggestions:", error);
        }
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, isVisible]);

  if (!isVisible || (!loading && suggestions.length === 0)) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 z-50 bg-gray-800 border border-gray-700 rounded-b-lg shadow-lg">
      {loading ? (
        <div className="p-3 text-center text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      ) : (
        <ul className="max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <button
                onClick={() => onSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                {suggestion.startsWith("category:") ||
                suggestion.startsWith("artist:") ||
                suggestion.startsWith("language:") ? (
                  <span>
                    <span className="text-pink-400">
                      {suggestion.split(":")[0]}:
                    </span>
                    {suggestion.split(":")[1]}
                  </span>
                ) : (
                  suggestion
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

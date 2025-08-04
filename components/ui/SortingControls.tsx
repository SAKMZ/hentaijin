"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { config } from "@/lib/config";

interface SortingControlsProps {
  currentSort?: string;
}

export const SortingControls: React.FC<SortingControlsProps> = ({
  currentSort,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: config.SORT_OPTIONS.NEW, label: "🆕 Newest", icon: "🆕" },
    { value: config.SORT_OPTIONS.POPULAR, label: "🔥 Popular", icon: "🔥" },
    { value: config.SORT_OPTIONS.HOT, label: "💥 Hot", icon: "💥" },
    { value: config.SORT_OPTIONS.DATE, label: "📅 By Date", icon: "📅" },
    { value: config.SORT_OPTIONS.ALPHABETICAL, label: "🔤 A-Z", icon: "🔤" },
    { value: config.SORT_OPTIONS.PAGES, label: "📄 Most Pages", icon: "📄" },
  ];

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sortValue === config.SORT_OPTIONS.NEW) {
      // Default sort, remove the parameter
      params.delete("sort");
    } else {
      params.set("sort", sortValue);
    }

    // Reset to first page when changing sort
    params.delete("page");

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "";

    router.push(`/${newUrl}`);
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded-lg">
      <div className="text-sm text-gray-400 font-medium mr-2 flex items-center">
        Sort by:
      </div>
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSortChange(option.value)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            (currentSort || config.SORT_OPTIONS.NEW) === option.value
              ? "bg-pink-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <span className="hidden sm:inline">{option.label}</span>
          <span className="sm:hidden">{option.icon}</span>
        </button>
      ))}
    </div>
  );
};

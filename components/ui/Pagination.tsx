"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PaginationInfo } from "@/types/gallery";
import { generatePageNumbers } from "@/lib/utils";

interface PaginationProps {
  pagination: PaginationInfo;
  baseUrl: string;
  searchParams?: URLSearchParams;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  baseUrl,
  searchParams,
}) => {
  const router = useRouter();
  const { currentPage, totalPages, hasPrev, hasNext } = pagination;

  const createPageUrl = (page: number): string => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex justify-center items-center space-x-2 mt-8"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      {hasPrev ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Previous
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted border border-border rounded-lg cursor-not-allowed">
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="hidden sm:flex space-x-1">
        {pageNumbers.map((page, index) => (
          <span key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-sm text-muted-foreground">
                ...
              </span>
            ) : (
              <Link
                href={createPageUrl(page as number)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  page === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground bg-card border border-border hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {page}
              </Link>
            )}
          </span>
        ))}
      </div>

      {/* Mobile Page Info */}
      <div className="sm:hidden px-4 py-2 text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </div>

      {/* Next Button */}
      {hasNext ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Next
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted border border-border rounded-lg cursor-not-allowed">
          Next
        </span>
      )}
    </nav>
  );
};

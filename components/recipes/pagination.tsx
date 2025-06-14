"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      replace(createPageURL(page));
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrevPage}
        onClick={() => goToPage(currentPage - 1)}
        className="border-[#E5E7EB] dark:border-[#2D2D2D] text-[#111827] dark:text-[#F4F4F5] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-[#4B5563] dark:text-[#A1A1AA]">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page as number)}
                className={
                  currentPage === page
                    ? "bg-[#16A34A] dark:bg-[#22C55E] text-white hover:bg-[#15803D] dark:hover:bg-[#16A34A] border-0"
                    : "border-[#E5E7EB] dark:border-[#2D2D2D] text-[#111827] dark:text-[#F4F4F5] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1A1A] bg-[#FFFFFF] dark:bg-[#0F0F0F]"
                }
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        disabled={!hasNextPage}
        onClick={() => goToPage(currentPage + 1)}
        className="border-[#E5E7EB] dark:border-[#2D2D2D] text-[#111827] dark:text-[#F4F4F5] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
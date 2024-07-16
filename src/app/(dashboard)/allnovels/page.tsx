"use server";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { getAllNovels } from "@/lib/apiCall/server/getAllNovel";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TNovel } from "@/lib/types/api/novel";
import NovelItem from "../_components/TopUpDialog/NovelItem";

const page = async ({ searchParams }: { searchParams: any }) => {
  const currentPage = Number(searchParams.page ? searchParams.page : 1);
  const response = await getAllNovels(currentPage);

  const totalPages = response?.data?.total_pages;
  const commonClasses =
    "inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 w-10";

  return (
    <div>
      <div className="bg-[#010313] w-[70%] mx-auto p-6 rounded-md">
        <div className="div space-y-4 px-4">
          {response?.data?.records?.map((item: TNovel) => (
            <NovelItem
              key={item.id}
              novelData={item}
              variant="extended"
              linkPath={`/novel/${item.id}`}
            />
          ))}
        </div>
      </div>

      {(response?.data?.total_records ?? 0) > 10 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              {currentPage > 1 && (
                <Link href={`?page=${currentPage - 1}`}>
                  <Button
                    variant="outline"
                    className="text-white hover:bg-background hover:text-white"
                  >
                    Previous
                  </Button>
                </Link>
              )}
            </PaginationItem>

            {Array.from({ length: totalPages! }, (_, i) => i + 1).map(
              (pageNum) => (
                <PaginationItem key={pageNum}>
                  <Link
                    className={`${commonClasses} ${
                      currentPage === pageNum ? "border-2 border-input" : ""
                    }`}
                    href={`?page=${pageNum}`}
                  >
                    {pageNum}
                  </Link>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              {currentPage < totalPages! && (
                <Link href={`?page=${currentPage + 1}`}>
                  <Button
                    variant="outline"
                    className="text-white hover:bg-background hover:text-white"
                  >
                    Next
                  </Button>
                </Link>
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default page;

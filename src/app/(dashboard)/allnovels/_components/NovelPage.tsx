"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { TNovel, TNovelMetadata } from "@/lib/types/api/novel";
import { TPaginationResponseDto } from "@/lib/types/api/page";
import React, { FC } from "react";
import NovelItem, {
  TNovelItemPreparingTaskState,
} from "../../_components/NovelItem";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import NovelPreparingDialog, {
  TNovelPreparingDialogHandle,
} from "../../_components/NovelPreparingDialog";
import { refreshNovelPage } from "@/lib/apiCall/server/getAllNovel";

export type TNovelPageProps = {
  currentPage: number;
  novelPageRespDto?: TPaginationResponseDto<TNovel> | undefined;
};

const NovelPage: FC<TNovelPageProps> = ({ currentPage, novelPageRespDto }) => {
  const router = useRouter();
  const novelPreparingDialogHandleRef =
    React.useRef<TNovelPreparingDialogHandle>(null);
  const commonClasses =
    "inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 w-10";

  const totalPages = React.useMemo(() => {
    return novelPageRespDto?.total_pages ?? 0;
  }, [novelPageRespDto?.total_pages]);

  const handleNavigate = React.useCallback(
    (id: string) => {
      router.push(`/novel/${id}`, { scroll: false });
    },
    [router]
  );

  const handleOnNovelItemClick = React.useCallback(
    (novel: TNovel, prepareState: TNovelItemPreparingTaskState) => {
      console.log("🚀 ~ NovelPage ~ novel:", novel);
      console.log("🚀 ~ NovelPage ~ prepareState:", prepareState);
      if (
        novel.metadata.preparing_status === "ready" ||
        prepareState.preparingStatus === "ready"
      ) {
        handleNavigate(novel.id);
      } else {
        novelPreparingDialogHandleRef.current?.open(novel, prepareState);
      }
    },
    [handleNavigate]
  );

  const handleAfterDelete = React.useCallback(async () => {
    await refreshNovelPage();
  }, []);

  return (
    <React.Fragment>
      <div>
        <div className="bg-[#010313] w-[70%] mx-auto p-6 rounded-md">
          <div className="div space-y-4 px-4">
            {novelPageRespDto?.records?.map((item: TNovel) => (
              <NovelItem
                key={item.id}
                novelData={item}
                variant="extended"
                onClick={(item, prepareState) =>
                  handleOnNovelItemClick(item, prepareState)
                }
                afterDeleteCallback={handleAfterDelete}
              />
            ))}
          </div>
        </div>

        {(novelPageRespDto?.total_records ?? 0) > 10 && (
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
      <NovelPreparingDialog
        ref={novelPreparingDialogHandleRef}
        showTrigger={false}
      />
    </React.Fragment>
  );
};

export default NovelPage;

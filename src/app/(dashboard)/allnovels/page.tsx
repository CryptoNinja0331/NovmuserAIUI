"use server";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import Link from "next/link";
import { getAllNovels } from "@/lib/apiCall/server/getAllNovel";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RiDeleteBin6Line } from "react-icons/ri";

const page = async ({ searchParams }: { searchParams: any }) => {
  let currentPage = Number(searchParams.page ? searchParams.page : 1);

  let response = await getAllNovels(currentPage);

  const totalPages = response?.data?.total_pages;
  const commonClasses =
    "inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 w-10";

  return (
    <div>
      <div className="bg-[#010313] w-[70%] mx-auto p-6 rounded-md">
        <div className="div space-y-6 px-4 ">
          {response?.data?.records?.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 items-center"
            >
              <Link href={`/${item.id}`} className="w-[95%]">
                <div className="text-[#817691]   font-medium capitalize cursor-pointer p-4 bg-[#160929] rounded-lg">
                  <div className="">
                    <h1 className="heading-color font-medium">
                      {" "}
                      {item.metadata.name}
                    </h1>
                  </div>
                </div>
              </Link>
              <div className="flex-1 flex justify-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <RiDeleteBin6Line className=" text-2xl text-[#FF453A] cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>

      {response?.data?.total_records > 10 && (
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
              {currentPage < totalPages && (
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

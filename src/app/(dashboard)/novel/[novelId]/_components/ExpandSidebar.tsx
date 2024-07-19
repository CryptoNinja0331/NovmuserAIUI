"use client";

import NovelItem, {
  TNovelItemPreparingTaskState,
} from "@/app/(dashboard)/_components/NovelItem";
import NovelPreparingDialog, {
  TNovelPreparingDialogHandle,
} from "@/app/(dashboard)/_components/NovelPreparingDialog";
import logo from "@/assets/logo-tiny.svg";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCreatedNovelQuery } from "@/lib/apiCall/client/clientAPi";
import { useToken } from "@/lib/hooks";
import { TNovel } from "@/lib/types/api/novel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { Button } from "../../../../../components/ui/button";

const ExpandSidebar = () => {
  const router = useRouter();
  const novelPreparingDialogHandleRef =
    React.useRef<TNovelPreparingDialogHandle>(null);
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [novelData, setNovelData] = useState<TNovel[]>([]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const { token } = useToken();
  const {
    isLoading = true,
    data,
    error = {},
  } = useGetCreatedNovelQuery({
    page_number: "1",
    page_size: "8",
    userId: token,
  });
  useEffect(() => {
    if (!isLoading && data?.data?.records) {
      setNovelData(data.data.records);
    }
  }, [isLoading, data?.data?.records]);

  const handleNavigate = React.useCallback(
    (id: string) => {
      router.push(`/novel/${id}`, { scroll: false });
    },
    [router]
  );

  const handleViewMore = () => {
    router.push(`/allnovels`, { scroll: false });
  };

  const handleOnNovelItemClick = React.useCallback(
    (novel: TNovel, prepareState: TNovelItemPreparingTaskState) => {
      console.log("🚀 ~ ExpandSidebar ~ novel:", novel);
      console.log("🚀 ~ ExpandSidebar ~ prepareState:", prepareState);
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

  console.log(" ~ ExpandSidebar rendering");

  return (
    <React.Fragment>
      <div
        className={`h-full transition-all duration-500 ease-in-out ${
          isExpanded ? "w-[17rem] bg-[#0000001a]" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full">
          {isExpanded ? (
            <div className="flex-grow h-full bg-[#0000001a]">
              <div className="flex min-h-[65px] pl-4 border-b border-gray-700">
                <div
                  onClick={() => router.push(`/`, { scroll: false })}
                  className="flex cursor-pointer gap-1 mr-2 items-center"
                >
                  <Image
                    className="cursor-pointer"
                    width={30}
                    height={30}
                    src={logo}
                    alt="logo"
                  />
                  <h1 className="font-medium text-xl">NovmuserAi</h1>
                </div>
                <div
                  onClick={toggleSidebar}
                  className="px-[15px] flex justify-center items-center border-l border-gray-700 cursor-pointer"
                >
                  <BiSolidLeftArrow className="text-white" />
                </div>
                <div className="px-[15px] flex justify-center items-center border-l border-gray-700 cursor-pointer">
                  <IoMdSettings className="text-white cursor-pointer" />
                </div>
              </div>
              <div className="mt-4">
                <NovelPreparingDialog showTrigger triggerText="Add Novel" />

                <div className="mt-6">
                  {!isLoading ? (
                    <>
                      <div className="div space-y-3 px-4">
                        {novelData?.map((item) => (
                          <NovelItem
                            key={item.id}
                            novelData={item}
                            onClick={(item, prepareState) =>
                              handleOnNovelItemClick(item, prepareState)
                            }
                            className={cn({
                              "bg-[#05020ca3]": pathname.includes(item.id),
                            })}
                          />
                        ))}
                      </div>

                      {novelData.length > 7 && (
                        <Button
                          onClick={handleViewMore}
                          variant="outline"
                          className="mx-auto flex mt-6 hover:bg-background hover:text-white hover:opacity-60 hover:scale-105"
                        >
                          View More...
                        </Button>
                      )}
                    </>
                  ) : (
                    // Show skeleton
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-[250px] bg-[#655e70]" />
                        <Skeleton className="h-3 w-[200px] bg-[#655e70]" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-[250px] bg-[#655e70]" />
                        <Skeleton className="h-3 w-[200px] bg-[#655e70]" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-[250px] bg-[#655e70]" />
                        <Skeleton className="h-3 w-[200px] bg-[#655e70]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={toggleSidebar}
              className="cursor-pointer flex gap-2 items-center p-2 bg-[#191B31] absolute top-[2rem]"
            >
              <Image width={20} height={20} src={logo} alt="logo" />
              <BiSolidRightArrow className="text-white" />
            </div>
          )}
        </div>
      </div>
      <NovelPreparingDialog
        ref={novelPreparingDialogHandleRef}
        showTrigger={false}
      />
    </React.Fragment>
  );
};

export default ExpandSidebar;

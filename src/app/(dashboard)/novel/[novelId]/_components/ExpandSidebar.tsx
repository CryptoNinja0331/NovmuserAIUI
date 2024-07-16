"use client";

import { useEffect, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import Image from "next/image";
import logo from "@/assets/logo-tiny.svg";
import NovelInitForm from "../../../../../components/ui/novelInitForm";
import { useAuth } from "@clerk/nextjs";
import { useGetCreatedNovelQuery } from "@/lib/apiCall/client/clientAPi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../../../../../components/ui/button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React from "react";
import { useToken } from "@/lib/hooks";
import NovelItem from "@/app/(dashboard)/_components/TopUpDialog/NovelItem";
import { TNovel } from "@/lib/types/api/novel";
import { cn } from "@/lib/utils";

const ExpandSidebar = () => {
  const router = useRouter();
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

  const handleNavigate = (id: string) => {
    router.push(`/novel/${id}`, { scroll: false });
  };

  const handleViewMore = () => {
    router.push(`/allnovels`, { scroll: false });
  };

  return (
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
              <NovelInitForm />

              <div className="mt-6">
                {!isLoading ? (
                  <>
                    <div className="div space-y-3 px-4">
                      {novelData?.map((item) => (
                        <NovelItem
                          key={item.id}
                          novelData={item}
                          onClick={() => handleNavigate(item.id)}
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
  );
};

export default ExpandSidebar;

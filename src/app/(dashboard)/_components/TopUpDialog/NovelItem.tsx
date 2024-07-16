"use client";

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
import { TooltipWrapper } from "@/components/ui/tooltip";
import useClientHttp from "@/hooks/useClientHttp";
import { useGetClientToken } from "@/lib/hooks";
import { TResponseDto } from "@/lib/http";
import {
  TNovel,
  TNovelMetadata,
  TNovelPreparingTask,
} from "@/lib/types/api/novel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { FC } from "react";
import { FaBook } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UrlObject } from "url";

const PreparingStatusTag = ({
  status,
  className,
}: {
  status: TNovelMetadata["preparing_status"];
  className?: string | undefined;
}) => {
  return (
    <TooltipWrapper
      tooltipContent={status}
      contentClassName="text-white bg-indigo-950"
    >
      <GoDotFill
        className={cn(
          "flex flex-col justify-center items-center px-1 font-light text-xs rounded-full",
          {
            "bg-green-500 text-green-900": status === "ready",
            "bg-yellow-500 text-yellow-900 animate-ping":
              status === "preparing",
            "bg-gray-500 text-gray-900 animate-pulse": status === "pending",
          },
          className
        )}
      />
    </TooltipWrapper>
  );
};

export type TNovelItemProps = {
  novelData: TNovel;
  variant?: "tiny" | "extended";
  showDelButton?: boolean;
  className?: string | undefined;
  linkPath?: string | UrlObject;
  onClick?: () => void;
};

const NovelItem: FC<TNovelItemProps> = ({
  novelData,
  variant = "tiny",
  onClick,
  className,
  linkPath,
}) => {
  const [preparingStatus, setPreparingStatus] = React.useState<
    TNovelMetadata["preparing_status"]
  >(novelData.metadata.preparing_status);

  const { get } = useClientHttp();
  const { getClientToken } = useGetClientToken();
  const intervalRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (preparingStatus === "ready") {
      return;
    }

    const getNovelPreparingTask = async (
      novelId: string
    ): Promise<TResponseDto<TNovelPreparingTask>> => {
      return await get({
        url: `/novel/prepare/${novelId}/task`,
        token: await getClientToken(),
      });
    };

    if (!intervalRef.current) {
      intervalRef.current = setInterval(async () => {
        try {
          const novelPreparingTaskRespDto = await getNovelPreparingTask(
            novelData.id
          );
          console.log(
            "🚀 ~ React.useEffect ~ novelPreparingTaskRespDto:",
            novelPreparingTaskRespDto
          );
          const taskStatus = novelPreparingTaskRespDto.data?.status;
          if (taskStatus === "PENDING") {
            setPreparingStatus((preStatus) => {
              if (preStatus === "pending") {
                return "preparing";
              }
              return preStatus;
            });
          } else if (taskStatus === "FINISHED") {
            setPreparingStatus("ready");
          }
        } catch (error) {
          console.error("🚀 ~ intervalRef.current=setInterval ~ error:", error);
          if (!(error instanceof Error && error.cause)) {
            clearInterval(intervalRef.current);
            return;
          }
          if (error.cause === 404) {
            console.log(
              "🚀 ~ intervalRef.current=setInterval ~ error.cause:",
              error.cause
            );
            setPreparingStatus((preparingStatus) => {
              if (preparingStatus === "preparing") {
                setTimeout(() => clearInterval(intervalRef.current), 1_000);
                return "ready";
              } else {
                return preparingStatus;
              }
            });
          }
        }
      }, 1_500);
    }
  }, [get, getClientToken, novelData.id, preparingStatus]);

  return (
    <div
      className={cn(
        "bg-indigo-700/20 hover:bg-indigo-950/70 active:bg-indigo-950 rounded-lg",
        className
      )}
    >
      {variant === "tiny" ? (
        <div
          className={
            "flex flex-row justify-start items-center font-medium capitalize cursor-pointer p-3 gap-6"
          }
          onClick={onClick}
        >
          <PreparingStatusTag status={preparingStatus} />
          <TooltipWrapper tooltipContent={novelData.metadata.name}>
            <div
              className={cn("flex flex-row items-center gap-4 truncate", {
                "animate-pulse": preparingStatus === "preparing",
                "opacity-40 animate-pulse": preparingStatus === "pending",
              })}
            >
              <FaBook className="text-lg" />
              <span className="max-w-32 text-sm truncate">
                {novelData.metadata.name}
              </span>
            </div>
          </TooltipWrapper>
        </div>
      ) : (
        <div className="flex flex-row justify-between gap-4 items-center px-1">
          <Link
            href={linkPath!}
            className="flex flex-row w-[90%] max-w-[90%] text-gray-600 font-medium capitalize cursor-pointer p-4 rounded-lg gap-6"
          >
            <PreparingStatusTag status={preparingStatus} />
            <TooltipWrapper
              tooltipContent={novelData.metadata.name}
              triggerClassName="w-[60%] truncate"
            >
              <h1
                className={cn("text-left heading-color font-medium truncate", {
                  "animate-pulse": preparingStatus === "preparing",
                  "opacity-40 animate-pulse": preparingStatus === "pending",
                })}
              >
                {novelData.metadata.name}
              </h1>
            </TooltipWrapper>
          </Link>
          <div className="flex-1 flex justify-end mr-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <RiDeleteBin6Line className=" text-2xl text-[#FF453A] cursor-pointer" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
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
      )}
    </div>
  );
};

export default React.memo(NovelItem);

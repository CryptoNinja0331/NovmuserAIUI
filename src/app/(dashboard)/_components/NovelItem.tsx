"use client";

import DeleteNovel from "@/components/singleNovel/DeleteNovel";
import { TooltipWrapper } from "@/components/ui/tooltip";
import useClientHttp from "@/hooks/useClientHttp";
import emitter from "@/lib/emitters";
import { useGetClientToken } from "@/lib/hooks";
import { TResponseDto } from "@/lib/http";
import {
  TNovel,
  TNovelMetadata,
  TNovelPreparingTask,
} from "@/lib/types/api/novel";
import { cn } from "@/lib/utils";
import React, { FC, MouseEventHandler } from "react";
import { FaBook } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

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

export type TNovelItemPreparingTaskState = {
  preparingStatus: TNovelMetadata["preparing_status"];
} & Pick<TNovelPreparingTask, "last_step_field">;

export type TNovelItemProps = {
  novelData: TNovel;
  variant?: "tiny" | "extended";
  showDelButton?: boolean;
  className?: string | undefined;
  onClick?: (novel: TNovel, prepareState: TNovelItemPreparingTaskState) => void;
  afterDeleteCallback?: () => Promise<void>;
};

const NovelItem: FC<TNovelItemProps> = ({
  novelData,
  variant = "tiny",
  onClick,
  afterDeleteCallback,
  className,
}) => {
  const [preparingTaskState, setPreparingTaskState] =
    React.useState<TNovelItemPreparingTaskState>({
      preparingStatus: novelData.metadata.preparing_status,
    });

  const { get } = useClientHttp();
  const { getClientToken } = useGetClientToken();
  const intervalRef = React.useRef<any>(null);

  const [needToInitInterval, setNeedToInitInterval] = React.useState<boolean>(
    novelData.metadata.preparing_status === "preparing"
  );

  React.useEffect(() => {
    const unSub = emitter.on("novelItem-interval", (novelId) => {
      if (novelId === novelData.id) {
        setNeedToInitInterval(true);
      }
    });
    return () => {
      unSub();
    };
  }, [novelData.id]);

  React.useEffect(() => {
    console.log("🚀 ~ needToInitInterval:", needToInitInterval);
    if (preparingTaskState.preparingStatus === "ready") {
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

    const doClearInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!intervalRef.current && needToInitInterval) {
      console.log("ready to set internal", novelData.id);
      intervalRef.current = setInterval(async () => {
        try {
          const novelPreparingTaskRespDto = await getNovelPreparingTask(
            novelData.id
          );
          console.log(
            "🚀 ~ React.useEffect ~ novelPreparingTaskRespDto:",
            novelPreparingTaskRespDto
          );
          const novelPreparingTask = novelPreparingTaskRespDto.data;
          const taskStatus = novelPreparingTask?.status;
          const lastStepField =
            novelPreparingTask?.last_step_field ??
            preparingTaskState.last_step_field;
          if (taskStatus === "PENDING") {
            setPreparingTaskState((prevState) => {
              if (prevState.preparingStatus === "pending") {
                return {
                  preparingStatus: "preparing",
                  last_step_field: lastStepField,
                };
              }
              if (
                lastStepField &&
                prevState.last_step_field !== lastStepField
              ) {
                return {
                  ...prevState,
                  last_step_field: lastStepField,
                };
              }
              return prevState;
            });
          } else {
            // Finished or Cancelled
            setTimeout(() => doClearInterval(), 1_000);
            setPreparingTaskState({
              preparingStatus: "ready",
              last_step_field: lastStepField,
            });
          }
        } catch (error) {
          console.error("🚀 ~ intervalRef.current=setInterval ~ error:", error);
          clearInterval(intervalRef.current);
        }
      }, 2_000);
    }

    return () => {
      console.log("novel item unmounted", novelData.id);
      doClearInterval();
    };
  }, [
    get,
    getClientToken,
    needToInitInterval,
    novelData.id,
    preparingTaskState.last_step_field,
    preparingTaskState.preparingStatus,
  ]);

  const handleOnItemClick = React.useCallback<MouseEventHandler<any>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick?.(novelData, preparingTaskState);
    },
    [novelData, onClick, preparingTaskState]
  );

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
          onClick={handleOnItemClick}
        >
          {/* <PreparingStatusTag status={preparingStatus} /> */}
          <PreparingStatusTag status={preparingTaskState.preparingStatus} />
          <TooltipWrapper tooltipContent={novelData.metadata.name}>
            <div
              className={cn("flex flex-row items-center gap-4 truncate", {
                "animate-pulse":
                  preparingTaskState.preparingStatus === "preparing",
                "opacity-40 animate-pulse":
                  preparingTaskState.preparingStatus === "pending",
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
          <div
            className="flex flex-row w-[90%] max-w-[90%] text-gray-600 font-medium capitalize cursor-pointer p-4 rounded-lg gap-6"
            onClick={handleOnItemClick}
          >
            <PreparingStatusTag status={preparingTaskState.preparingStatus} />
            <TooltipWrapper
              tooltipContent={novelData.metadata.name}
              triggerClassName="w-[60%] truncate"
            >
              <h1
                className={cn("text-left heading-color font-medium truncate", {
                  "animate-pulse":
                    preparingTaskState.preparingStatus === "preparing",
                  "opacity-40 animate-pulse":
                    preparingTaskState.preparingStatus === "pending",
                })}
              >
                {novelData.metadata.name}
              </h1>
            </TooltipWrapper>
          </div>
          <div className="flex-1 flex justify-end mr-2">
            {/* <AlertDialog>
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
            </AlertDialog> */}
            <DeleteNovel
              novelId={novelData.id}
              afterDeleteCallback={afterDeleteCallback}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(NovelItem);

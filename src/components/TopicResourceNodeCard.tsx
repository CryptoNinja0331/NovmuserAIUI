import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TTopicResourceType } from "@/lib/types/api/chapter";
import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { AiOutlineExpandAlt, AiOutlineShrink } from "react-icons/ai";
import SimpleBar from "simplebar-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TTopicResourceVariants =
  | "activeMode"
  | "finishedMode"
  | "inActiveMode";

type TTopicResourceNodeCardProps = {
  resourceType: TTopicResourceType;
  variants?: TTopicResourceVariants | undefined;
  cardTitle?: string;
  cardContent?: string;
  className?: string | undefined;
  onClick?: () => void;
};
const TopicResourceNodeCard: FC<TTopicResourceNodeCardProps> = ({
  resourceType,
  variants = "inActiveMode",
  cardTitle,
  cardContent,
  className,
  onClick,
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const cardContentRenderer = React.useMemo(() => {
    if (expanded) {
      return <SimpleBar style={{ maxHeight: "80px" }}>{cardContent}</SimpleBar>;
    }
    return <div className="truncate">{cardContent}</div>;
  }, [cardContent, expanded]);

  const toggleExpand = React.useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const resourceTypeBadgeText = React.useMemo(
    () => (resourceType === "topic" ? "Topic" : "Point"),
    [resourceType]
  );

  return (
    <Card
      className={cn(
        "rounded-lg",
        {
          "border-purple-500": variants === "activeMode",
          "border-green-500": variants === "finishedMode",
          "border-gray-500": variants === "inActiveMode",
        },
        {
          "bg-purple-500/30":
            variants === "activeMode" && resourceType === "topic",
          "bg-green-500/30":
            variants === "finishedMode" && resourceType === "topic",
          "bg-gray-500/30":
            variants === "inActiveMode" && resourceType === "topic",
          "bg-purple-500/15":
            variants === "activeMode" && resourceType === "topicPoint",
          "bg-green-500/15":
            variants === "finishedMode" && resourceType === "topicPoint",
          "bg-gray-500/15":
            variants === "inActiveMode" && resourceType === "topicPoint",
        },
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex p-1 rounded-t-lg text-white">
        <div
          className={cn(
            "flex-1 flex flex-row justify-start items-center gap-2 border-b p-1",
            {
              "border-purple-500": variants === "activeMode",
              "border-green-500": variants === "finishedMode",
              "border-gray-500": variants === "inActiveMode",
            }
          )}
        >
          <div
            className={cn(
              "rounded-lg px-1 py-0 font-bold font-mono text-[10px] text-indigo-100 ",
              { "text-orange-300": resourceType === "topicPoint" },
              {
                "bg-purple-600/80": variants === "activeMode",
                "bg-green-600/80": variants === "finishedMode",
                "bg-gray-600/80": variants === "inActiveMode",
              }
            )}
          >
            {resourceTypeBadgeText}
          </div>
          {cardTitle && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="font-semibold truncate py-0 text-sm cursor-default">
                  {cardTitle}
                </TooltipTrigger>
                <TooltipContent className="z-auto text-white bg-indigo-950">
                  <p>{cardTitle}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent
        className={cn("p-1 font-thin text-gray-50", {
          "text-sm": resourceType === "topic",
          "text-xs": resourceType === "topicPoint",
        })}
      >
        {cardContentRenderer}
        <div className="flex-1 flex flex-row justify-end items-baseline text-white text-lg font-medium px-2">
          <div
            className="cursor-pointer hover:opacity-40"
            onClick={toggleExpand}
          >
            {expanded ? <AiOutlineShrink /> : <AiOutlineExpandAlt />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(TopicResourceNodeCard);

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { AiOutlineExpandAlt, AiOutlineShrink } from "react-icons/ai";
import SimpleBar from "simplebar-react";

type TTopicResourceNodeCardProps = {
  resourceType: "Topic" | "Point";
  variants?: "activeMode" | "finishedMode" | "inActiveMode";
  cardTitle?: string;
  cardContent?: string;
  className?: string | undefined;
};
const TopicResourceNodeCard: FC<TTopicResourceNodeCardProps> = ({
  resourceType,
  variants = "inActiveMode",
  cardTitle,
  cardContent,
  className,
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

  return (
    <Card
      className={cn(
        "rounded-lg bg-[#0C0C0D]",
        {
          "border-purple-500": variants === "activeMode",
          "border-green-500": variants === "finishedMode",
          "border-gray-500": variants === "inActiveMode",
        },
        {
          "bg-purple-500/25":
            variants === "activeMode" && resourceType === "Topic",
          "bg-green-500/25":
            variants === "finishedMode" && resourceType === "Topic",
          "bg-gray-500/25":
            variants === "inActiveMode" && resourceType === "Topic",
          "bg-purple-500/10":
            variants === "activeMode" && resourceType === "Point",
          "bg-green-500/10":
            variants === "finishedMode" && resourceType === "Point",
          "bg-gray-500/10":
            variants === "inActiveMode" && resourceType === "Point",
        },
        className
      )}
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
              "rounded-lg px-1 py-0 font-bold font-mono text-[10px] text-yellow-200 ",
              {
                "bg-purple-600/80": variants === "activeMode",
                "bg-green-600/80": variants === "finishedMode",
                "bg-gray-600/80": variants === "inActiveMode",
              }
            )}
          >
            {resourceType}
          </div>
          {cardTitle && (
            <div className="font-semibold truncate py-0">{cardTitle}</div>
          )}
        </div>
      </CardHeader>
      <CardContent
        className={cn("p-1 font-thin text-gray-50", {
          "text-sm": resourceType === "Topic",
          "text-xs": resourceType === "Point",
        })}
      >
        {cardContentRenderer}
        <div className="flex-1 flex flex-row justify-end items-baseline text-white text-lg font-medium px-2">
          <div
            className="cursor-pointer hover:text-gray-500"
            onClick={toggleExpand}
          >
            {expanded ? <AiOutlineShrink /> : <AiOutlineExpandAlt />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TopicRoadMapTree = () => {
  return (
    <div className="flex flex-col gap-3">
      <TopicResourceNodeCard
        {...{
          resourceType: "Topic",
          cardTitle: "The Enchanting and",
          // variants: "activeMode",
          variants: "finishedMode",
          cardContent:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius quae odio voluptate veritatis fuga. Exercitationem, nemo optio expedita non, nam sunt ut voluptas ad sapiente voluptatem voluptate laudantium? Maxime a perferendis veniam ex, odit sed quae eius nostrum tenetur harum omnis assumenda? Eius, quibusdam vitae aliquid natus deleniti sapiente corporis corrupti recusandae impedit obcaecati debitis, ipsum ab exercitationem laborum, assumenda molestiae optio unde officiis? Consequatur mollitia quos quisquam aut hic ad recusandae deleniti, optio velit. Nemo optio non quidem ut? Vel, dignissimos ea! Illo, fugiat suscipit maxime doloremque consequuntur, distinctio culpa expedita omnis autem delectus ullam, commodi modi! Velit, reiciendis.",
        }}
      />
      <TopicResourceNodeCard
        {...{
          resourceType: "Point",
          // variants: "activeMode",
          variants: "finishedMode",
          cardContent:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius quae odio voluptate veritatis fuga. Exercitationem, nemo optio expedita non, nam sunt ut voluptas ad sapiente voluptatem voluptate laudantium? Maxime a perferendis veniam ex, odit sed quae eius nostrum tenetur harum omnis assumenda? Eius, quibusdam vitae aliquid natus deleniti sapiente corporis corrupti recusandae impedit obcaecati debitis, ipsum ab exercitationem laborum, assumenda molestiae optio unde officiis? Consequatur mollitia quos quisquam aut hic ad recusandae deleniti, optio velit. Nemo optio non quidem ut? Vel, dignissimos ea! Illo, fugiat suscipit maxime doloremque consequuntur, distinctio culpa expedita omnis autem delectus ullam, commodi modi! Velit, reiciendis.",
        }}
        className="w-[90%]"
      />
    </div>
  );
};

export default TopicRoadMapTree;

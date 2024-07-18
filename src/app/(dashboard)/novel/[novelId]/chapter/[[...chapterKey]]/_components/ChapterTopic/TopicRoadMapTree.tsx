import TopicResourceNodeCard from "@/components/TopicResourceNodeCard";
import { TChapterTopicsDoc, TTopicResourceType } from "@/lib/types/api/chapter";
import React, { FC } from "react";
import { ChapterContext } from "../../context/useChapterContext";

type TTopicRoadMapTreeData = {
  id: string;
  title?: string;
  content?: string;
  nodeType: TTopicResourceType;
  children?: TTopicRoadMapTreeData[];
};

export type TTopicRoadMapTreeProps = {
  chapterTopics?: TChapterTopicsDoc;
};
const TopicRoadMapTree: FC<TTopicRoadMapTreeProps> = ({
  chapterTopics = { topics: [] },
}) => {
  const { currentPointerId, currentTopicId, updateCurrentId } =
    React.useContext(ChapterContext);

  const roadMapTreeData = React.useMemo<TTopicRoadMapTreeData[]>(() => {
    return chapterTopics?.topics?.map((topic) => ({
      id: topic.id,
      title: topic.name,
      content: topic.abstract,
      nodeType: "topic",
      children: topic.topic_points?.map((topicPoint) => ({
        id: topicPoint.id,
        content: topicPoint.point_content,
        nodeType: "topicPoint",
      })),
    }));
  }, [chapterTopics]);

  return (
    <div className="flex flex-col gap-2 my-2">
      {roadMapTreeData?.map((topicTreeNode) => {
        return (
          <React.Fragment key={topicTreeNode.id}>
            <TopicResourceNodeCard
              key={topicTreeNode.id}
              {...{
                resourceType: "topic",
                cardTitle: topicTreeNode.title,
                variants:
                  topicTreeNode.id == currentTopicId ? "activeMode" : undefined,
                cardContent: topicTreeNode.content,
              }}
            />
            {topicTreeNode.children?.map((topicPointTreeNode) => {
              return (
                <div
                  key={topicPointTreeNode.id}
                  className="flex flex-row justify-end"
                >
                  <TopicResourceNodeCard
                    {...{
                      resourceType: "topicPoint",
                      variants:
                        topicPointTreeNode.id == currentPointerId
                          ? "activeMode"
                          : undefined,
                      cardContent: topicPointTreeNode.content,
                    }}
                    className="w-[88%] cursor-pointer"
                    onClick={() =>
                      updateCurrentId(topicTreeNode.id, topicPointTreeNode.id)
                    }
                  />
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default React.memo(TopicRoadMapTree);

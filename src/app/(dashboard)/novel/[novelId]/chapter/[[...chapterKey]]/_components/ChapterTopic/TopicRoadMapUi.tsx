"use client";
import React from 'react';
import { TChapterInfo } from "@/lib/types/api/chapter";
import SimpleBar from "simplebar-react";
import { ChapterContext } from '../../context/useChapterContext';

interface TopicRoadMapUiProps {
  chapterInfo: TChapterInfo;
}

const TopicRoadMapUi = ({ chapterInfo}: TopicRoadMapUiProps) => {
  const { currentPointerId, currentTopicId, updateCurrentId } = React.useContext(ChapterContext)
  console.log(chapterInfo, currentPointerId, currentTopicId, "from roadmap");
  const getTopicPointColor = (topicId: string, pointId: string) => {
    const activatedPoint = topicId == currentTopicId && pointId == currentPointerId
    return activatedPoint ? "bg-purple-500 text-white" : "";
  };

  const getTopicColor = (topicId: string, topicPoints: any[]) => {
    const isAnyTopicPointActivated = topicId == currentTopicId;
    return isAnyTopicPointActivated ? "bg-purple-500 text-white" : "";
  };

  return (
    <SimpleBar style={{ maxHeight: "74vh" }}>
      <div
        className={chapterInfo?.details?.chapter_chunks ? "text-slate-500" : ""}
      >
        {chapterInfo?.details?.chapter_topics?.topics.map((item) => (
          <div key={item.id}>
            <div
              className={`${getTopicColor(
                item.id,
                item.topic_points
              )} bg-[#0C0C0D] my-2 border relative border-input rounded-md p-1`}
            >
              <div className="flex items-center justify-between">
                <h1>Topic: </h1>
                <h1 className="truncate">{item.name}</h1>
              </div>
            </div>
            {item.topic_points.map((point) => (
              <div
                onClick={() => updateCurrentId(item.id, point.id)}
                key={point.id}
                className="flex mb-2 justify-end items-center"
              >
                <div
                  className={`${getTopicPointColor(
                    item.id,
                    point.id
                  )} bg-[#0C0C0D] w-[70%] cursor-pointer border relative topics-point border-input rounded-md p-2`}
                >
                  <div className="text-center">
                    <h1 className="font-medium ">Topics point</h1>
                    <p className="my-1 truncate"> {point.point_content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </SimpleBar>
  );
};

export default TopicRoadMapUi;

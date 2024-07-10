"use client";
import { TChapterInfo } from "@/lib/types/api/chapter";
import SimpleBar from "simplebar-react";
import TopicRoadMapTree from "./TopicRoadMapTree";

interface TopicRoadMapUiProps {
  chapterInfo: TChapterInfo;
}

const TopicRoadMapUi = ({ chapterInfo }: TopicRoadMapUiProps) => {
  return (
    <div>
      <SimpleBar style={{ maxHeight: "74vh" }}>
        <TopicRoadMapTree
          chapterTopics={chapterInfo?.details?.chapter_topics ?? []}
        />
      </SimpleBar>
    </div>
  );
};

export default TopicRoadMapUi;

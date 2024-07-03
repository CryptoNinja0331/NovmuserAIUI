"use client";

import "simplebar-react/dist/simplebar.min.css";

import { TChapterInfo } from "@/lib/types/api/chapter";
import React from "react";
import { FaEdit } from "react-icons/fa";
import TopicEditingDialog, {
  TTopicEditingDialogHandle,
} from "../ChapterTopic/TopicEditingDialog";

interface ChapterUiProps {
  novelId: string;
  chapterInfo: TChapterInfo;
}

const ChapterUi = ({ novelId, chapterInfo }: ChapterUiProps) => {
  const topicEditingDialogRef = React.useRef<TTopicEditingDialogHandle>(null);

  return (
    <div>
      <h1 className="p-2 flex gap-1 items-center font-medium border-b border-input">
        Topic Roadmap
        {chapterInfo?.details?.chapter_topics && (
          <FaEdit
            className="cursor-pointer"
            onClick={() => topicEditingDialogRef.current?.openDialog()}
          />
        )}
      </h1>
      <TopicEditingDialog
        ref={topicEditingDialogRef}
        {...{ novelId, chapterInfo }}
      />
    </div>
  );
};

export default ChapterUi;

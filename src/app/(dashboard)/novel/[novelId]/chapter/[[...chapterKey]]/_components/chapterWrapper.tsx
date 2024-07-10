"use client";
import React from "react";
import { TChapterInfo } from "@/lib/types/api/chapter";
import ChapterDetails from "./Chapter/ChapterDetails";
import NovelEditingArea from "./Chapter/ChapterEditingArea";
import { ChapterProvider } from "../context/useChapterContext";
interface TChapterWrapperProps {
  chapterKey: string[];
  novelId: string;
  chapterInfo: TChapterInfo;
}

const ChapterWrapper = ({
  chapterKey,
  novelId,
  chapterInfo,
}: TChapterWrapperProps) => {
  return (
    <ChapterProvider>
      <div className="inline-block w-[16rem] h-full border-r border-input p-3">
        <ChapterDetails
          {...{
            novelId: novelId,
            chapterNumber: chapterKey[1],
            chapterTitle: chapterKey[2],
            chapterInfo,
          }}
        />
      </div>
      <NovelEditingArea novelId={novelId} chapterInfo={chapterInfo} />
    </ChapterProvider>
  );
};
export default ChapterWrapper;

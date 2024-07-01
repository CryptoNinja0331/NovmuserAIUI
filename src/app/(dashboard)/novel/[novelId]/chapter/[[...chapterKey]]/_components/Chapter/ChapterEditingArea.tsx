"use client";

import { getOrInitChapterInfo } from "@/lib/apiCall/server/getOrInitChapterInfo";
import useStreamedChunksStore, {
  TStreamedChunk,
} from "@/lib/store/chapterChunks/streamedChunksStore";
import { TChapterInfo } from "@/lib/types/api/chapter";
import React, { FC } from "react";
import SimpleBar from "simplebar-react";
import { shallow } from "zustand/shallow";
import StreamedChunk from "../ChapterChunk/StreamedChunk";
import Terminal from "../ChapterChunk/Terminal";

export type TNovelEditingAreaProps = {
  novelId: string;
  chapterInfo: TChapterInfo;
  // fetchChapterInfo: () => Promise<TChapterInfo>;
};

const NovelEditingArea: FC<TNovelEditingAreaProps> = ({
  novelId,
  chapterInfo,
  // fetchChapterInfo,
}) => {
  const [curChapterInfo, setCurChapterInfo] =
    React.useState<TChapterInfo>(chapterInfo);

  const initChunksFromChapterInfo = useStreamedChunksStore(
    (state) => state.initChunksFromChapterInfo
  );

  const streamedChunks: TStreamedChunk[] = useStreamedChunksStore(
    (state) => state.streamedChunks
  );
  const simpleBarRef = React.useRef<typeof SimpleBar>(null);

  // React.useEffect(() => {
  //   initChunksFromChapterInfo(chapterInfo);
  // }, [initChunksFromChapterInfo, chapterInfo]);

  React.useEffect(() => {
    initChunksFromChapterInfo(curChapterInfo);
    console.log("initialized chunks from chapter info");
  }, [initChunksFromChapterInfo, curChapterInfo]);

  React.useEffect(() => {
    const simpleBarCur: any = simpleBarRef.current;
    const unSub = useStreamedChunksStore.subscribe(
      (state) => state.currentIndex,
      (curIndex) => {
        if (curIndex === streamedChunks.length - 1) {
          if (simpleBarCur) {
            // Scroll to bottom of content
            simpleBarCur.scrollTop = simpleBarCur.scrollHeight;
          }
        }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      }
    );

    return () => {
      unSub();
    };
  }, [streamedChunks]);

  const refreshChapterInfo = React.useCallback(async () => {
    const updatedChapterInfo = (
      await getOrInitChapterInfo({
        novelId,
        chapterKey: chapterInfo.chapter_key,
      })
    )?.data;
    if (updatedChapterInfo) {
      setCurChapterInfo(updatedChapterInfo);
      console.log("refreshed and set current chapter info");
    }
  }, [chapterInfo.chapter_key, novelId]);

  return (
    <div className="w-full h-full relative px-1">
      <SimpleBar
        scrollableNodeProps={{ ref: simpleBarRef }}
        className="w-full h-full bg-slate-900/70 pb-[40%]"
      >
        <div className="overflow-auto">
          <div className="py-2 px-4">
            {streamedChunks.map((chunk, index) => (
              <StreamedChunk
                key={index}
                index={index}
                content={chunk.content}
              />
            ))}
          </div>
        </div>
      </SimpleBar>
      <Terminal
        // chapterInfo={chapterInfo}
        chapterInfo={curChapterInfo}
        chapterKey={chapterInfo.chapter_key}
        className="fixed bottom-1"
        refreshChapterInfo={refreshChapterInfo}
      />
    </div>
  );
};

export default React.memo(NovelEditingArea);
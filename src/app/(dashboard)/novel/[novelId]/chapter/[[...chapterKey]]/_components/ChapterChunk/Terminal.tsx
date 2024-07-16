"use client";

import { TChapterInfo, TChunkType } from "@/lib/types/api/chapter";
import ChunkGenerationButtonPair from "./ChunkGenerationButtonPair";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback, useRef, FC, useContext } from 'react';
import { IoMdEye } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";
import SimpleBar from "simplebar-react";
import { useAuth } from "@clerk/nextjs";
import { updateHumanFirstChunk } from "@/lib/store/features/chunkSlice";
import { useAppDispatch } from "@/lib/hooks";
import { customRevalidateTag } from "@/lib/actions/revalidateTag";
import { cn } from "@/lib/utils";
import { ChapterContext } from '../../context/useChapterContext';

export type TTerminalProps = {
  chapterKey: string;
  chapterInfo: TChapterInfo;
  className?: string | undefined;
  refreshChapterInfo: () => Promise<void>;
};

const Terminal: FC<TTerminalProps> = ({
  chapterKey,
  chapterInfo,
  refreshChapterInfo,
  ...rest
}) => {
  const [nextPointChecked, setNextPointChecked] = useState(true);
  const [userFeedback, setUserFeedback] = useState("");
  const { currentChunkId } = useContext(ChapterContext)
  const [generatedChunks, setGeneratedChunks] = useState<Record<string, any>>(
    {}
  );

  const getColor = (chunkType: TChunkType) => {
    if (chunkType === "leader") {
      return "#531E41";
    } else if (chunkType === "follower") {
      return "#4D216C";
    } else {
      return "inherit";
    }
  };
  const concatenatedContent = chapterInfo?.details?.chapter_chunks?.map(
    (chunk) => {
      const { chunk_content, metadata } = chunk;
      const { chunk_type } = metadata || {};
      const chunkId = chunk.id;
      const generatedText = generatedChunks[chunkId] || chunk_content;

      return {
        text: generatedText,
        color: getColor(chunk_type),
        chunkId: chunkId,
      };
    }
  );

  const editableContent = concatenatedContent
    ?.map((chunk) => chunk.text)
    .join(" ");



  const replaceChunkText = (chunkId: string, newText: string) => {
    setGeneratedChunks((prevChunks) => ({
      ...prevChunks,
      [chunkId]: newText,
    }));
  };


  return (
    <div className={cn("w-auto border-input", rest.className)}>
      <div className="flex flex-col bg-[#414481] p-3 w-auto mx-auto rounded-xl">
        <div className="my-2">
          <Input
            onChange={(e) => setUserFeedback(e.target.value)}
            value={userFeedback}
            className="text-[1.1rem] text-white h-[3.5rem]"
            placeholder="Enter your idea here"
          />
        </div>
        <div className="flex flex-row justify-between gap-8 items-center py-2">
          <div className="flex justify-between items-center gap-4">
            <Button
              className="flex gap-1 items-center bg-[#1A1647] hover:bg-background hover:text-white"
              variant="outline"
            >
              <IoMdEye className="" />
              <h1>Trace chunks</h1>
            </Button>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={nextPointChecked}
                onCheckedChange={() => setNextPointChecked(!nextPointChecked)}
                id="terms"
              />
              Link to next point
            </div>
          </div>
          <ChunkGenerationButtonPair
            userFeedback={userFeedback}
            selectedChunkId={currentChunkId}
            chapterInfo={chapterInfo}
            nextPointChecked={nextPointChecked}
            chapterKey={chapterKey}
            replaceChunkText={replaceChunkText}
            refreshChapterInfo={refreshChapterInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;

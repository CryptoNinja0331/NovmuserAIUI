"use client";

import { TChapterInfo } from "@/lib/types/api/chapter";
import ChunkGenerationButtonPair from "./ChunkGenerationButtonPair";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback, useRef, FC } from "react";
import { IoMdEye } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";
import SimpleBar from "simplebar-react";
import { useAuth } from "@clerk/nextjs";
import { updateHumanFirstChunk } from "@/lib/store/features/chunkSlice";
import { useAppDispatch } from "@/lib/hooks";
import { customRevalidateTag } from "@/lib/actions/revalidateTag";
import { cn } from "@/lib/utils";

const debounce = (func, delay) => {
  let debounceTimer;
  return function (...args) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

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
  const [streamedText, setStreamedText] = useState({ text: "", data: null });
  const [nextPointChecked, setNextPointChecked] = useState(true);
  const [userFeedback, setUserFeedback] = useState("");
  const [selectedChunkId, setSelectedChunkId] = useState(undefined);
  const [generatedChunks, setGeneratedChunks] = useState({});
  const [removeCurrentChunk, setRemoveCurrentChunk] = useState(false);
  const [leaderChunkExists, setLeaderChunkExists] = useState(false);

  const { getToken } = useAuth();
  const contentEditableRef = useRef(null);
  const getColor = (chunkType) => {
    if (chunkType === "leader") {
      return "#531E41";
    } else if (chunkType === "follower") {
      return "#4D216C";
    } else {
      return "inherit";
    }
  };
  const dispatch = useAppDispatch();
  const concatenatedContent = chapterInfo?.details?.chapter_chunks.map(
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

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer.parentNode;
      const endContainer = range.endContainer.parentNode;

      if (startContainer.dataset.chunkId) {
        setSelectedChunkId(startContainer.dataset.chunkId);
      } else if (endContainer.dataset.chunkId) {
        setSelectedChunkId(endContainer.dataset.chunkId);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("selectionchange", handleTextSelection);
    return () => {
      document.removeEventListener("selectionchange", handleTextSelection);
    };
  }, []);

  const replaceChunkText = (chunkId, newText) => {
    setGeneratedChunks((prevChunks) => ({
      ...prevChunks,
      [chunkId]: newText,
    }));
  };

  const saveContent = useCallback(
    debounce(async (newContent) => {
      if (!selectedChunkId) return;
      const userId = await getToken({ template: "UserToken" });
      const savePayload = {
        chunk_id: selectedChunkId,
        chunk_content: newContent,
      };
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/update/chunk`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userId}`,
          },
          body: JSON.stringify(savePayload),
        }
      );
    }, 60000), // 60000 milliseconds = 1 minute
    [selectedChunkId, getToken, chapterKey]
  );

  const debouncedSaveContent = useCallback(
    debounce(
      async (newText, userId, chapterKey, topicDetails, leaderChunkExists) => {
        if (!selectedChunkId && !editableContent) {
          dispatch(updateHumanFirstChunk(true));

          const payload = {
            cur_chunk: {
              metadata: {
                topic_mapping: {
                  topic_id: topicDetails?.details?.chapter_topics?.topics[0].id,
                  topic_point_id:
                    topicDetails?.details?.chapter_topics?.topics[0]
                      ?.topic_points[0]?.id,
                },
                chunk_type: "leader",
                generate_from: "human",
              },
              chunk_content: newText,
            },
            is_first_chunk: true,
          };
          if (!leaderChunkExists) {
            const saveResponse = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userId}`,
                },
                body: JSON.stringify(payload),
              }
            );
            if (saveResponse.ok) {
              const responseData = await saveResponse.json();
              setLeaderChunkExists(true);
              customRevalidateTag("chapterInfo");
            } else {
              console.error("Failed to save changes");
            }
          } else {
            const updatePayload = {
              chunk_id: topicDetails?.details?.chapter_topics?.topics[0].id,
              chunk_content: newText,
            };
            fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/update/chunk`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userId}`,
                },
                body: JSON.stringify(updatePayload),
              }
            ).then((saveResponse) => {
              if (saveResponse.ok) {
                saveResponse.json().then((responseData) => {
                  customRevalidateTag("chapterInfo");
                });
              } else {
                console.error("Failed to save changes");
              }
            });
          }
        } else {
          saveContent(newText);
        }
      },
      500
    ), // 60000 milliseconds = 1 minute
    [
      selectedChunkId,
      editableContent,
      leaderChunkExists,
      getToken,
      dispatch,
      chapterKey,
      chapterInfo,
    ]
  );

  const handleContentChange = (e) => {
    const newText = e.target.innerText;
    getToken({ template: "UserToken" }).then((userId) => {
      debouncedSaveContent(
        newText,
        userId,
        chapterKey,
        chapterInfo,
        leaderChunkExists
      );
    });
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
            selectedChunkId={selectedChunkId}
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

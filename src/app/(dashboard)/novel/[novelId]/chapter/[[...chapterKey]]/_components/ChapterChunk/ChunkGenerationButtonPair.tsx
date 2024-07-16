"use client";
import BalanceNotEnoughAlert from "@/components/alert/BalanceNotEnoughAlert";
import { Button } from "@/components/ui/button";
import { customRevalidateTag } from "@/lib/actions/revalidateTag";
import emitter from "@/lib/emitters";
import { useGetClientToken } from "@/lib/hooks";
import { PATCH } from "@/lib/http";
import useStreamedChunksStore from "@/lib/store/chapterChunks/streamedChunksStore";
import {
  TChapterInfo,
  TChunkStreamEventDto,
} from "@/lib/types/api/chapter";
import { useAuth } from "@clerk/nextjs";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Loader2 } from "lucide-react";
import React, { FC, useContext, useState } from 'react';
import { FaRobot } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "sonner";
import { ChapterContext } from '../../context/useChapterContext';
import { TStreamedChunk } from '../../../../../../../../lib/store/chapterChunks/streamedChunksStore';
import { getNextTopicAndChunkId, getUUid } from '../../../../../../../../lib/utils';

export type TChunkGenerationButtonPairProps = {
  chapterKey: string;
  nextPointChecked: boolean;
  selectedChunkId?: string;
  userFeedback?: string;
  replaceChunkText: (chunkId: string, newText: string) => void;
  chapterInfo: TChapterInfo;
  refreshChapterInfo: () => Promise<void>;
};

const TYPING_SPEED = 24;

const ChunkGenerationButtonPair: FC<TChunkGenerationButtonPairProps> = ({
  chapterKey,
  userFeedback,
  nextPointChecked,
  chapterInfo,
}) => {
  const {
    appendChunk,
    appendChunkContent,
    setIsStreaming,
    getChunkById,
    streamedChunks,
    replaceChunkContentById
  } = useStreamedChunksStore();

  const [generating, setGenerating] = useState<boolean>(false);
  const [regenerateLoading, setRegenrateLoading] = useState(false);
  const { currentTopicId, currentPointerId, currentChunkId } = useContext(ChapterContext)
  const { getToken } = useAuth();

  const chapterChunks = chapterInfo.details?.chapter_chunks ?? [];


  const isFirstChunk = React.useMemo<boolean>(() => {
    return chapterChunks.length === 0;
  }, [chapterChunks.length]);

  const getStreamGenerationPayload = () => {
    if (isFirstChunk || nextPointChecked) {
      return {
        is_first_chunk: isFirstChunk,
        user_feedback: userFeedback,
        chunk_type: 'leader',
      }
    }
    let prevChunk = getChunkById(currentChunkId)
    let chunkType = 'follower'

    const result = {
      prev_chunk: {
        id: prevChunk.id,
        metadata: {
          topic_mapping: {
            topic_id: prevChunk.metadata.topic_mapping.topic_id,
            topic_point_id: prevChunk.metadata.topic_mapping.topic_point_id,
          },
          chunk_type: prevChunk.metadata.chunk_type,
          generate_from: prevChunk.metadata.generate_from,
        }
      },
      is_first_chunk: isFirstChunk,
      user_feedback: userFeedback,
      chunk_type: chunkType,
    }
    console.log(result, 'result')
    return result
  }

  const stopGeneratingWithTimeout = React.useCallback(
    (timeout: number = 3_000) => {
      setTimeout(() => {
        setGenerating(false);
      }, timeout);
    },
    []
  );
  const getNewChunk = () => {
    if (isFirstChunk && streamedChunks.length == 0) {
      const topics = chapterInfo.details.chapter_topics?.topics || [];
      return {
        id: getUUid(),
        isStreaming: true,
        content: "",
        metadata: {
          topic_mapping: {
            topic_point_id: topics[0].topic_points[0].id,
            topic_id: topics[0].id
          },
          generate_from: 'ai',
          chunk_type: 'leader'
        }
      }
    }
    if (nextPointChecked) {
      const lastChunk = streamedChunks[streamedChunks.length - 1];
      const prevPointer = lastChunk.metadata.topic_mapping.topic_point_id;
      const topics = chapterInfo.details.chapter_topics?.topics || [];
      const { topic_point_id, topic_id } = getNextTopicAndChunkId(topics, prevPointer)
      console.log(prevPointer, topic_id, topic_point_id)
      return {
        id: getUUid(),
        isStreaming: true,
        content: "",
        metadata: {
          topic_mapping: {
            topic_point_id: topic_point_id,
            topic_id: topic_id
          },
          generate_from: 'ai',
          chunk_type: 'leader'
        }
      }
    } else if (currentTopicId && currentPointerId) {
      return  {
        id: getUUid(),
        isStreaming: true,
        content: "",
        metadata: {
          topic_mapping: { // todo 下一个pointer topicId 和pointerId 应该传什么
            topic_id: currentTopicId,
            topic_point_id: currentPointerId
          },
          generate_from: 'ai',
          chunk_type: 'follower'
        }
      }
    } else {
      const preChunk = streamedChunks[streamedChunks.length - 1]
      return {
        id: getUUid(),
        isStreaming: true,
        content: "",
        metadata: {
          topic_mapping: {
            topic_id: preChunk.metadata.topic_mapping.topic_id,
            topic_point_id: preChunk.metadata.topic_mapping.topic_point_id
          },
          generate_from: 'ai',
          chunk_type:  'follower'
        }
      }
    }
  }
  const handleNextChunk = async () => {
    const userToken = await getToken({ template: "UserToken" });
    setGenerating(true);
    let counter = 0;
    await fetchEventSource(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk_stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(getStreamGenerationPayload()),
        onopen: async (resp) => {
          if (resp.ok && resp.status === 201) {
            console.log(resp)
            counter = 1;
            let newChunk: TStreamedChunk = getNewChunk();
              appendChunk(newChunk, currentChunkId);
              console.log("Connection made ", resp);
            } else if (
              resp.status >= 400 &&
              resp.status < 500 &&
              resp.status !== 429
            ) {
              console.log("Client side error ", resp);
            }
            console.log("Connection made ", resp);
          } else if (
            resp.status >= 400 &&
            resp.status < 500 &&
            resp.status !== 429
          ) {
            console.log("Client side error ", resp);
            if (resp.status === 402) {
              emitter.emit("402-error", "Credits not enough");
              console.log("🚀 ~ emitter.emit 402 error");
            }
          }
        },
        onmessage: async (event) => {
          const dataStr = event.data;
          let chunkStreamEventDto;
          try {
            chunkStreamEventDto = JSON.parse(dataStr) as TChunkStreamEventDto;
          } catch (e) {
            console.error("Received data is not valid JSON:", dataStr);
            return;
          }
          counter++;
          const content = chunkStreamEventDto.content;
          const isFinal = chunkStreamEventDto.is_final;
          setTimeout(() => {
            appendChunkContent(content, isFinal);
          }, TYPING_SPEED * counter);

        },
        onclose: () => {
          console.log("Connection closed by the server");
          counter = 0;
          setIsStreaming(false);
          stopGeneratingWithTimeout();
        },
        onerror: (err) => {
          console.log("There was an error from server", err);
          counter = 0;
          setIsStreaming(false);
          stopGeneratingWithTimeout();
          throw err;
        },
      }
    );
  };

  const handleRegenerate = async () => {
    setRegenrateLoading(true);
    if (!userFeedback || !currentChunkId) {
      setRegenrateLoading(false);

      toast.error("Select the chunk or input your feedback");
      return;
    }
    const userId = await getToken({ template: "UserToken" });
    const payload = {
      chunk_id: currentChunkId,
      user_feedback: userFeedback,
    };
    let counter = 0;
    await fetchEventSource(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk_stream/re_generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify(payload),
        onopen: async (resp) => {
          if (resp.ok && resp.status === 201) {
            console.log(resp)
            counter = 1;
            replaceChunkContentById('', currentChunkId)
            console.log("Connection made ", resp);
          } else if (
            resp.status >= 400 &&
            resp.status < 500 &&
            resp.status !== 429
          ) {
            console.log("Client side error ", resp);
          }
        },
        onmessage: async (event) => {
          const dataStr = event.data;
          let chunkStreamEventDto;
          try {
            chunkStreamEventDto = JSON.parse(dataStr) as TChunkStreamEventDto;
          } catch (e) {
            console.error("Received data is not valid JSON:", dataStr);
            return;
          }
          counter++;
          const content = chunkStreamEventDto.content;
          const isFinal = chunkStreamEventDto.is_final;
          setTimeout(() => {
            appendChunkContent(content, isFinal);
          }, TYPING_SPEED * counter);

        },
        onclose: () => {
          console.log("Connection closed by the server");
          counter = 0;
          setIsStreaming(false);
          setRegenrateLoading(false);
        },
        onerror: (err) => {
          console.log("There was an error from server", err);
          counter = 0;
          setIsStreaming(false);
          setRegenrateLoading(false);
          throw err;
        },
      }
    );
  };

  return (
    <div>
      <div className="w-1/2 flex gap-3 justify-between items-center">
        <Button
          onClick={handleRegenerate}
          className="flex gap-1 min-w-[180px] bg-[#1A1647] items-center hover:bg-background hover:text-white"
          variant="outline"
        >
          {regenerateLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              PLEASE WAIT
            </>
          ) : (
            <>
              <GrPowerReset className="mt-[5px]" /> Re-generate
            </>
          )}
        </Button>
        <Button
          onClick={handleNextChunk}
          disabled={generating}
          className="min-w-[180px] button-gradient-2 z-[49] flex gap-1 items-center"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              PLEASE WAIT
            </>
          ) : (
            <>
              <FaRobot className="text-xl" /> Next Chunk
            </>
          )}
        </Button>
      </div>
      <BalanceNotEnoughAlert />
    </div>
  );
};

export default React.memo(ChunkGenerationButtonPair);

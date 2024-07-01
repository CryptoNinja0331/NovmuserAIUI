"use client";
import { Button } from "@/components/ui/button";
import { customRevalidateTag } from "@/lib/actions/revalidateTag";
import { useAppDispatch, useGetClientToken } from "@/lib/hooks";
import { addChunkData } from "@/lib/store/features/chunkSlice";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { useState } from "react";
import { FaRobot } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "sonner";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { todo } from "node:test";
import useStreamedChunksStore from "@/lib/store/chapterChunks/streamedChunksStore";
import {
  TChapterChunk,
  TChapterInfo,
  TChapterTopic,
  TChunkStreamEventDto,
  TChunkType,
} from "@/lib/types/api/chapter";
import {
  TChunkGenerationReqDto,
  TChunkReqDto,
  TChunkSaveDto,
} from "@/lib/types/api/request/chapterRequest";
import { PATCH } from "@/lib/http";

export type TChunkGenerationButtonPairProps = {
  chapterKey: string;
  //   setStreamedText: React.Dispatch<React.SetStateAction<string>>;
  //   streamedText: string;
  nextPointChecked: boolean;
  //   setNextPointChecked: React.Dispatch<React.SetStateAction<boolean>>;
  selectedChunkId?: string;
  userFeedback?: string;
  replaceChunkText: (chunkId: string, newText: string) => void;
  chapterInfo: TChapterInfo;
  refreshChapterInfo: () => Promise<void>;
};

const TYPING_SPEED = 24;

const ChunkGenerationButtonPair: FC<TChunkGenerationButtonPairProps> = ({
  chapterKey,
  selectedChunkId,
  userFeedback,
  replaceChunkText,
  nextPointChecked,
  chapterInfo,
  refreshChapterInfo,
}) => {
  const { getClientToken } = useGetClientToken();
  const { appendChunk, appendChunkContent, setIsStreaming } =
    useStreamedChunksStore((state) => ({
      appendChunk: state.appendChunk,
      appendChunkContent: state.appendChunkContent,
      setIsStreaming: state.setIsStreaming,
    }));

  //   const [isStreaming, setIsStreaming] = useState(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [fullStreamedText, setFullStreamedText] = useState("");
  const [regenerateLoading, setRegenrateLoading] = useState(false);
  const [doneEventData, setDoneEventData] = useState<any>(null);

  const { getToken } = useAuth();
  // const latestChunk =
  //   chapterInfo.details?.chapter_chunks?.[
  //     chapterInfo.details?.chapter_chunks?.length - 1
  //   ];

  const chapterChunks = chapterInfo.details?.chapter_chunks ?? [];

  let prevChunk: TChapterChunk | undefined;
  if (selectedChunkId) {
    prevChunk = chapterChunks.find((chunk) => chunk.id === selectedChunkId);
  } else if (chapterChunks.length > 0) {
    prevChunk = chapterChunks[chapterChunks.length - 1];
  }

  //   const handleNextChunk = async () => {
  //     setIsStreaming(true);
  //     const userId = await getToken({ template: "UserToken" });
  //     const payload =
  //       topicDetails?.details?.chapter_chunks?.length === 0
  //         ? {
  //             is_first_chunk: true,
  //             user_feedback: "string",
  //             chunk_type: "leader",
  //           }
  //         : {
  //             prev_chunk: {
  //               id: latestChunk?.id,
  //               metadata: {
  //                 topic_mapping: {
  //                   topic_id: latestChunk?.metadata?.topic_mapping?.topic_id,
  //                   topic_point_id:
  //                     latestChunk?.metadata?.topic_mapping?.topic_point_id,
  //                 },
  //                 chunk_type: latestChunk?.metadata.chunk_type,
  //                 generate_from: latestChunk?.metadata.generate_from,
  //               },
  //             },
  //             is_first_chunk: false,
  //             user_feedback: "string",
  //             chunk_type: "follower",
  //           };

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk_stream`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${userId}`,
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (!response.body) {
  //       console.error("ReadableStream not supported");
  //       setIsStreaming(false);
  //       return;
  //     }

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();

  //     const processDataChunk = async (dataChunk) => {
  //       try {
  //         let buffer = "";
  //         const lines = dataChunk.trim().split("\n");
  //         for (const line of lines) {
  //           if (line.startsWith("data:") && line.endsWith("}")) {
  //             const data = JSON.parse(line.substring(5));
  //             if (data.content) {
  //               buffer += data.content;
  //             }
  //             if (data.is_final) {
  //               setDoneEventData(data);
  //               dispatch(addChunkData(data));
  //               setStreamedText((prevState) => ({
  //                 ...prevState,
  //                 data: data,
  //               }));

  //               let payload = {
  //                 cur_chunk: {
  //                   metadata: {
  //                     topic_mapping: {
  //                       topic_id: data.meta_data.cur_topic_id,
  //                       topic_point_id: data.meta_data.cur_topic_point_id,
  //                     },
  //                     chunk_type: data.meta_data.chunk_type,
  //                     generate_from: "ai",
  //                   },
  //                   chunk_content: data.meta_data.whole_content,
  //                 },
  //               };

  //               if (data.meta_data.chunk_type === "follower") {
  //                 payload = {
  //                   prev_chunk: {
  //                     id: latestChunk?.id,
  //                     metadata: {
  //                       topic_mapping: {
  //                         topic_id:
  //                           latestChunk?.metadata?.topic_mapping?.topic_id,
  //                         topic_point_id:
  //                           latestChunk?.metadata?.topic_mapping?.topic_point_id,
  //                       },
  //                       chunk_type: latestChunk?.metadata.chunk_type,
  //                       generate_from: latestChunk?.metadata.generate_from,
  //                     },
  //                   },
  //                   ...payload,
  //                 };
  //               }

  //               const saveResponse = await fetch(
  //                 `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk`,
  //                 {
  //                   method: "PATCH",
  //                   headers: {
  //                     "Content-Type": "application/json",
  //                     Authorization: `Bearer ${userId}`,
  //                     "Access-Control-Allow-Origin": "*",
  //                     "Access-Control-Allow-Credentials": "true",
  //                   },
  //                   body: JSON.stringify(payload),
  //                 }
  //               );
  //               if (saveResponse.ok) {
  //                 const responseData = await saveResponse.json();
  //               } else {
  //                 console.error("Failed to save changes");
  //               }
  //             }
  //           } else {
  //             console.error(
  //               "Invalid JSON format in data chunk, skipping line:",
  //               line
  //             );
  //           }
  //         }

  //         setFullStreamedText(buffer);

  //         const words = buffer.split(/\s+/);
  //         for (let i = 0; i < words.length; i++) {
  //           setTimeout(() => {
  //             setStreamedText((prevState) => ({
  //               ...prevState,
  //               text: prevState.text + words[i] + " ",
  //             }));
  //           }, i * 300);
  //         }

  //         buffer = "";
  //       } catch (error) {
  //         console.error("Error processing data chunk:", error);
  //       }
  //     };

  //     const streamProcessor = async () => {
  //       let done = false;
  //       while (!done) {
  //         const { value, done: streamDone } = await reader.read();
  //         done = streamDone;
  //         if (value) {
  //           const chunk = decoder.decode(value, { stream: !done });
  //           await processDataChunk(chunk);
  //         }
  //       }
  //       setIsStreaming(false);
  //     };

  //     await streamProcessor();
  //   };

  const chapterTopics: TChapterTopic[] = React.useMemo<TChapterTopic[]>(() => {
    return chapterInfo.details?.chapter_topics?.topics ?? [];
  }, [chapterInfo.details?.chapter_topics?.topics]);

  const isFirstChunk = React.useMemo<boolean>(() => {
    return chapterChunks.length === 0;
  }, [chapterChunks.length]);

  const chunkType = React.useMemo<TChunkType>(() => {
    if (
      !prevChunk ||
      chapterChunks.length === 0 ||
      chapterTopics.length === 0
    ) {
      return "leader";
    }
    if (!nextPointChecked) {
      return "follower";
    }
    // Check whether the previous chunk already belongs to the last topic point, if so,
    // the chunk type should be "follower", and ignore the option of "link to next point"
    const lastTopic = chapterTopics[chapterTopics.length - 1];
    const topicPointsInLastTopic = lastTopic.topic_points ?? [];
    const lastTopicPoint =
      topicPointsInLastTopic.length > 0
        ? topicPointsInLastTopic[topicPointsInLastTopic.length - 1]
        : undefined;
    if (!lastTopicPoint) {
      return "leader";
    }
    if (
      prevChunk.metadata.topic_mapping.topic_id === lastTopic.id &&
      prevChunk.metadata.topic_mapping.topic_point_id === lastTopicPoint.id
    ) {
      console.log("Previous chunk already belongs to the last topic point");
      return "follower";
    }
    return "leader";
  }, [chapterChunks.length, chapterTopics, nextPointChecked, prevChunk]);

  const chunkStreamGenerationPayload =
    React.useMemo<TChunkGenerationReqDto>(() => {
      return {
        prev_chunk:
          prevChunk &&
          ({
            id: prevChunk.id,
            metadata: {
              topic_mapping: {
                topic_id: prevChunk.metadata.topic_mapping.topic_id,
                topic_point_id: prevChunk.metadata.topic_mapping.topic_point_id,
              },
              chunk_type: prevChunk.metadata.chunk_type,
              generate_from: prevChunk.metadata.generate_from,
            },
          } as TChunkReqDto),
        is_first_chunk: isFirstChunk,
        user_feedback: userFeedback,
        chunk_type: chunkType,
      };
    }, [userFeedback, chunkType, prevChunk, isFirstChunk]);

  const stopGeneratingWithTimeout = React.useCallback(
    (timeout: number = 3_000) => {
      setTimeout(() => {
        setGenerating(false);
      }, timeout);
    },
    []
  );

  const handleNextChunk = React.useCallback(async () => {
    const userToken = await getToken({ template: "UserToken" });
    setGenerating(true);

    // Get chunk event stream
    // TODO 2024-06-12 Add the below function into lib/http

    const getSaveChunkPayload = (
      chunkStreamEventDto: TChunkStreamEventDto
    ): TChunkSaveDto => {
      const eventMetadata = chunkStreamEventDto.meta_data!;
      return {
        prev_chunk:
          prevChunk &&
          ({
            id: prevChunk.id,
            metadata: {
              topic_mapping: {
                topic_id: prevChunk.metadata.topic_mapping.topic_id,
                topic_point_id: prevChunk.metadata.topic_mapping.topic_point_id,
              },
              chunk_type: prevChunk.metadata.chunk_type,
              generate_from: prevChunk.metadata.generate_from,
            },
          } as TChunkReqDto),
        cur_chunk: {
          chunk_content: eventMetadata.whole_content ?? "",
          metadata: {
            topic_mapping: {
              topic_id: eventMetadata.cur_topic_id,
              topic_point_id: eventMetadata.cur_topic_point_id,
            },
            chunk_type: eventMetadata.chunk_type,
            generate_from: eventMetadata.generate_from,
          },
        },
        is_first_chunk: isFirstChunk,
      };
    };

    let counter = 0;
    await fetchEventSource(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk_stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(chunkStreamGenerationPayload),
        onopen: async (resp) => {
          if (resp.ok && resp.status === 201) {
            counter = 1;
            appendChunk();
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
          if (isFinal) {
            console.log("is final streaming");
            stopGeneratingWithTimeout();
            // TODO 2024-06-13 save generated chunk
            const token = await getClientToken();
            const eventMetadata = chunkStreamEventDto.meta_data;
            if (!eventMetadata) {
              console.warn("Failed to get metadata from stream event");
              return;
            }
            const chunkSavePayload = getSaveChunkPayload(chunkStreamEventDto);
            await PATCH({
              url: `/chapter/${chapterKey}/chunk`,
              token,
              data: chunkSavePayload,
            });
            await refreshChapterInfo();
          }
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
  }, [
    getToken,
    chapterKey,
    chunkStreamGenerationPayload,
    prevChunk,
    isFirstChunk,
    appendChunk,
    appendChunkContent,
    stopGeneratingWithTimeout,
    getClientToken,
    refreshChapterInfo,
    setIsStreaming,
  ]);

  const handleRegenerate = async () => {
    setRegenrateLoading(true);
    if (!userFeedback || !selectedChunkId) {
      setRegenrateLoading(false);

      toast.error("Select the chunk or input your feedback");
      return;
    }
    const userId = await getToken({ template: "UserToken" });
    const payload = {
      chunk_id: selectedChunkId,
      user_feedback: userFeedback,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk_stream/re_generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.body) {
      console.error("ReadableStream not supported");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const processDataChunk = (dataChunk: string) => {
      try {
        const lines = dataChunk.trim().split("\n");
        let newText = "";
        lines.forEach((line) => {
          if (line.startsWith("data:") && line.endsWith("}")) {
            const data = JSON.parse(line.substring(5));
            if (data.content) {
              newText += data.content;
              setRegenrateLoading(false);
            }
          } else {
            console.error(
              "Invalid JSON format in data chunk, skipping line:",
              line
            );
          }
        });
        replaceChunkText(selectedChunkId, newText);
        // After replacing the text, patch the API
        const savePayload = {
          chunk_id: selectedChunkId,
          chunk_content: newText,
        };
        fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/update/chunk`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userId}`,
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true",
            },
            body: JSON.stringify(savePayload),
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
      } catch (error) {
        console.error("Error processing data chunk:", error);
      }
    };

    let done = false;
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: !done });
        processDataChunk(chunk);
      }
    }
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
    </div>
  );
};

export default React.memo(ChunkGenerationButtonPair);

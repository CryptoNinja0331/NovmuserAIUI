import { TChapterChunk, TChapterInfo } from "@/lib/types/api/chapter";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type TStreamedChunk = {
  content: string;
  isStreaming: boolean;
};

type TStreamedChunksState = {
  streamedChunks: TStreamedChunk[];
  currentChunk: TStreamedChunk | undefined;
  currentIndex: number | undefined;
};

type TStreamedChunksAction = {
  initChunksFromChapterInfo: (chapterInfo: TChapterInfo) => void;
  appendChunk: (isStreaming?: boolean) => void;
  appendChunkContent: (nextText: string, isFinal?: boolean) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  reset: () => void;
};

const useStreamedChunksStore = create(
  subscribeWithSelector<TStreamedChunksState & TStreamedChunksAction>(
    (set, get) => ({
      currentChunk: undefined,
      currentIndex: undefined,
      streamedChunks: [],
      initChunksFromChapterInfo: (chapterInfo: TChapterInfo) => {
        if (
          !chapterInfo.details?.chapter_chunks ||
          chapterInfo.details.chapter_chunks.length < 1
        ) {
          return;
        }
        const chapterChunks: TChapterChunk[] =
          chapterInfo.details.chapter_chunks;
        // Convert chapterChunks to streamedChunks
        const streamedChunks = chapterChunks.map((chunk) => ({
          isStreaming: false,
          content: chunk.chunk_content,
        }));
        set({
          currentChunk: streamedChunks[streamedChunks.length - 1],
          currentIndex: streamedChunks.length - 1,
          streamedChunks,
        });
      },
      appendChunk: (isStreaming: boolean = true) => {
        const newChunk = {
          isStreaming,
          content: "",
        };
        set((state) => ({
          currentChunk: newChunk,
          currentIndex: state.streamedChunks.length,
          streamedChunks: [...state.streamedChunks, newChunk],
        }));
      },
      appendChunkContent: (nextText: string, isFinal: boolean = false) => {
        const targetChunk = get().currentChunk;
        const targetIndex = get().currentIndex;
        if (targetChunk && targetIndex) {
          const updatedChunk = {
            isStreaming: true,
            content: targetChunk.content + nextText,
          };
          if (isFinal) {
            // Sync into chunks
            set((state) => ({
              currentChunk: updatedChunk,
              streamedChunks: [
                ...state.streamedChunks.slice(0, targetIndex),
                updatedChunk,
                ...state.streamedChunks.slice(targetIndex + 1),
              ],
            }));
          } else {
            // Just update current chunk
            set(() => ({
              currentChunk: updatedChunk,
            }));
          }
        }
      },
      setIsStreaming: (isStreaming: boolean) => {
        const targetChunk = get().currentChunk;
        const targetIndex = get().currentIndex;
        if (targetChunk && targetIndex) {
          const updatedChunk = {
            ...targetChunk,
            isStreaming,
          };
          set((state) => ({
            currentChunk: updatedChunk,
            streamedChunks: [
              ...state.streamedChunks.slice(0, targetIndex),
              updatedChunk,
              ...state.streamedChunks.slice(targetIndex + 1),
            ],
          }));
        }
      },
      reset: () => {
        set({
          currentChunk: undefined,
          currentIndex: undefined,
          streamedChunks: [],
        });
      },
    })
  )
);

export default useStreamedChunksStore;

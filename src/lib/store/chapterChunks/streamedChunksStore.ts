import { TChapterChunkDoc, TChapterInfo } from "@/lib/types/api/chapter";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TChapterChunkMetaData } from '@/types/api/chapter';
import { cloneDeep } from '../../utils';
export type TStreamedChunk = {
  content: string;
  isStreaming: boolean; // 判断是否正在流式输出过程中
  metadata: TChapterChunkMetaData
};

type TStreamedChunksState = {
  streamedChunks: TStreamedChunk[];
  currentChunk: TStreamedChunk | undefined;
  currentIndex: number | undefined;
};

type TStreamedChunksAction = {
  initChunksFromChapterInfo: (chapterInfo: TChapterInfo) => void;
  appendChunk: (isStreaming?: boolean) => void;
  appendChunkWithContent: (chunk: TStreamedChunk, index: number) => void; // 手动添加chunk
  updateChunkContent: (content: string, index: number) => void;
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
        const chapterChunks: TChapterChunkDoc[] =
          chapterInfo.details.chapter_chunks;
        // Convert chapterChunks to streamedChunks
        const streamedChunks = chapterChunks.map((chunk) => ({
          isStreaming: false,
          content: chunk.chunk_content,
          metadata: chunk.metadata
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
      updateChunkContent: (content, index) => {
        const chunkList = get().streamedChunks;
        const copyChunk = cloneDeep(chunkList);
        if (index > copyChunk.length - 1) return;
        const item = copyChunk[index]
        item.content = content
        copyChunk.splice(index, 1, item)
        set({
          currentChunk: item,
          currentIndex: index,
          streamedChunks: copyChunk
        })
      },
      appendChunkWithContent: (chunk, index) => {
        const chunkList = get().streamedChunks;
        console.log(chunkList)
        const copyChunk = cloneDeep(chunkList)
        console.log(copyChunk)
        if (!chunk.content || index>copyChunk.length - 1) return;
        copyChunk.splice(index + 1, 0, chunk)
        console.log(copyChunk)
        set(state => ({
          currentChunk: chunk,
          streamedChunks: copyChunk,
          currentIndex: index + 1
        }))
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

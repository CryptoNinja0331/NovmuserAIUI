import { TChapterChunkDoc, TChapterInfo } from "@/lib/types/api/chapter";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TChapterChunkMetaData } from '@/types/api/chapter';
import { cloneDeep, getUUid } from '@/lib/utils';
import { PATCH } from '@/lib/http'
import { getToken } from "@/lib/apiCall/server/getToken";
import { debounce } from 'lodash-es';
export type TStreamedChunk = {
  id: string;
  content: string;
  isStreaming: boolean; // 判断是否正在流式输出过程中
  metadata: TChapterChunkMetaData
  has_persisted?: boolean; // 是否要替换id
};

type TStreamedChunksState = {
  streamedChunks: TStreamedChunk[];
  currentChunk: TStreamedChunk | undefined;
  currentIndex: number | undefined;
  hasSave: boolean; // 是否保存
  chapterInfo: TChapterInfo | undefined
};

type TStreamedChunksAction = {
  initChunksFromChapterInfo: (chapterInfo: TChapterInfo) => void;
  appendChunk: (isStreaming?: boolean) => void;
  appendChunkWithContent: (chunk: TStreamedChunk, index: number) => Promise; // 手动添加chunk
  updateChunkContent: (content: string, index: number) => void;
  appendChunkContent: (nextText: string, isFinal?: boolean) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  autoSaveChunk: (type: boolean) => Promise, // 自动保存chunk
  reset: () => void;
};
const timer = null
const useStreamedChunksStore = create(
  subscribeWithSelector<TStreamedChunksState & TStreamedChunksAction>(
    (set, get) => ({
      currentChunk: undefined,
      currentIndex: undefined,
      streamedChunks: [],
      hasSave: false,
      chapterInfo: undefined,
      initChunksFromChapterInfo: (chapterInfo: TChapterInfo) => {
        if (
          !chapterInfo.details?.chapter_chunks ||
          chapterInfo.details.chapter_chunks.length < 1
        ) {
          return;
        }
        console.log(chapterInfo, 'chapterInfo')
        const chapterChunks: TChapterChunkDoc[] =
          chapterInfo.details.chapter_chunks;
        // Convert chapterChunks to streamedChunks
        const streamedChunks: TStreamedChunk[] = chapterChunks.map((chunk) => ({
          id: chunk.id || getUUid(),
          isStreaming: false,
          content: chunk.chunk_content,
          metadata: chunk.metadata
        }));
        set({
          currentChunk: streamedChunks[streamedChunks.length - 1],
          currentIndex: streamedChunks.length - 1,
          streamedChunks,
          chapterInfo
        });
      },
      appendChunk: (isStreaming: boolean = true) => {
        const newChunk: TStreamedChunk = {
          id: getUUid(),
          isStreaming,
          content: "",
          metadata: {
            topic_mapping: {
              topic_id: '',
              topic_point_id: ''
            },
            generate_from: 'ai',
            chunk_type: 'follower' // todo 确认是否需要外面传入
          }
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
        get().autoSaveChunk(false)
      },
      appendChunkWithContent: (chunk, index) => {
        set(state => ({
          currentChunk: chunk,
          streamedChunks: [
            ...state.streamedChunks.slice(0, index + 1),
            chunk,
            ...state.streamedChunks.slice(index + 2),
          ],
          currentIndex: index + 1
        }))
        return get().autoSaveChunk(false)
      },
      appendChunkContent: (nextText: string, isFinal: boolean = false) => {
        const targetChunk = get().currentChunk;
        const targetIndex = get().currentIndex;
        if (targetChunk && targetIndex) {
          const updatedChunk = {
            ...targetChunk,
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
            get().autoSaveChunk(false)
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
      autoSaveChunk: (type) => {
        return new Promise(resolve => {
          const saveChunk = async () => {
            const chapterInfo = get().chapterInfo
            const streamedChunks = get().streamedChunks
            console.log(streamedChunks, 'autoSaveChunk')
            const res = await PATCH({
              url: `/chapter/${chapterInfo?.chapter_key}/fullEdit/chunks`,
              token: await getToken(),
              data: {
                chapter_editing_chunks: cloneDeep(streamedChunks).map((item: TStreamedChunk) => {
                  return {
                    ...item,
                    chunk_content: item.content
                  }
                }).filter(item => item.chunk_content)
              }
            })
            if (res.code == 200) {
              const initChunksFromChapterInfo = get().initChunksFromChapterInfo
              initChunksFromChapterInfo(res.data)
              resolve()
              console.log('🚀 has update chapterInfo', res.data)
            }
            console.log(res, 'auto save chunk')
          }
          saveChunk()
        })

      }
    })
  )
);

export default useStreamedChunksStore;

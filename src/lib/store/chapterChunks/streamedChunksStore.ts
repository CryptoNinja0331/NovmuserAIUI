import { TChapterChunkDoc, TChapterInfo } from "@/lib/types/api/chapter";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TChapterChunkMetaData } from '@/types/api/chapter';
import { cloneDeep, getUUid } from '@/lib/utils';
import { PATCH } from '@/lib/http'
import { getToken } from "@/lib/apiCall/server/getToken";
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
  chapterInfo: TChapterInfo | undefined;
  currentChunk: TStreamedChunk | undefined;
};

type TStreamedChunksAction = {
  initChunksFromChapterInfo: (chapterInfo: TChapterInfo) => void;
  appendChunk: (chunk: TStreamedChunk, chunkId?: string) => void;
  appendChunkWithContent: (chunk: TStreamedChunk, index: number) => Promise<any>; // 手动添加chunk
  updateChunkContent: (content: string, index: number) => void;
  appendChunkContent: (nextText: string, isFinal?: boolean) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  replaceChunkContentById: (content: string, chunkId: string) => void;
  getChunkById: (chunkId: string) => TStreamedChunk|undefined;
  autoSaveChunk: (type: boolean) => Promise<any>; // 自动保存chunk
  deleteChunk: (chunkId: string) => void; // 删除chunk
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
        if (chapterInfo) {
          set({
            chapterInfo
          })
        }
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
          streamedChunks
        });
      },
      getChunkById: (chunkId) => {
        const chunkList = get().streamedChunks;
        if (!chunkId) {
          return chunkList[chunkList.length - 1]
        }
        return chunkList?.find(item => item.id = chunkId)
      },
      deleteChunk: async (chunkId) => {
        const chapterInfo = get().chapterInfo;
        const res = await PATCH({
          url: `/chapter/${chapterInfo?.chapter_key}/delete/chunk/${chunkId}`,
          token: await getToken(),
        })
        if (res.code == 200) {
          console.log(res.data)
          get().initChunksFromChapterInfo(res.data)
        }
      },
      /**
       * 添加新chunk
       * @param chunk
       * @param chunkId 上一个chunk的id
       */
      appendChunk: (chunk, chunkId) => {
        if (get().streamedChunks.length == 0) {
          set((state) => ({
            currentChunk: chunk,
            currentIndex: 0,
            streamedChunks: [chunk]
          }))
          return
        }
        if (chunk.metadata.chunk_type == 'leader') {
          set((state) => ({
            currentChunk: chunk,
            currentIndex: state.streamedChunks.length + 1,
            streamedChunks: [...state.streamedChunks, chunk],
          }));
          return
        }
        let index = get().streamedChunks.findIndex(item => item.id == chunkId)
        if (index == -1) {
          // 如果没有上一个，则伟最后一个
          index = get().streamedChunks.length - 1
        }
        set((state) => ({
          currentChunk: chunk,
          currentIndex: index + 1,
          streamedChunks: [
            ...state.streamedChunks.slice(0, index + 1),
            chunk,
            ...state.streamedChunks.slice(index + 1),
          ],
        }));
      },
      updateChunkContent: (content, index) => {
        const chunkList = get().streamedChunks;
        const copyChunk = cloneDeep(chunkList);
        if (index > copyChunk.length - 1) return;
        const item = copyChunk[index]
        if (content == '') {
          console.log(item)
          get().deleteChunk(item.id)
        } else {
          item.content = content
          copyChunk.splice(index, 1, item)
          set({
            currentChunk: item,
            currentIndex: index,
            streamedChunks: copyChunk
          })
          get().autoSaveChunk(false).then(r => {})
        }

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
        if (typeof targetChunk != 'undefined' && typeof targetIndex != 'undefined') {
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
                {
                  ...updatedChunk,
                  isStreaming: false,
                  has_persisted: false,
                },
                ...state.streamedChunks.slice(targetIndex + 1),
              ],
            }));
            get().autoSaveChunk(false).then(r => {})
          } else {
            // Just update current chunk
            set(() => ({
              currentChunk: updatedChunk,
            }));
            console.log(get().currentChunk)
          }
        }
      },
      replaceChunkContentById (content= '', chunkId) {
        const index = get().streamedChunks.findIndex(item => item.id == chunkId)
        const chunk = get().streamedChunks?.[index]
        const copyChunk = cloneDeep(chunk);
        copyChunk.content = content;
        set({
          currentChunk: copyChunk,
          currentIndex: index
        })
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
            const res = await PATCH({
              url: `/chapter/${chapterInfo?.chapter_key}/fullEdit/chunks`,
              token: await getToken(),
              data: {
                chapter_editing_chunks: cloneDeep(streamedChunks).map((item: TStreamedChunk) => {
                  return {
                    ...item,
                    chunk_content: item.content
                  }
                }).filter(item => item.chunk_content.trim() != '' && item.id !== '')
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
          saveChunk().then(r => {})
        })

      }
    })
  )
);

export default useStreamedChunksStore;

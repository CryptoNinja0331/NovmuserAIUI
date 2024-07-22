import useStreamedChunksStore from "@/lib/store/chapterChunks/streamedChunksStore";
import { TChapterChunkMetaData } from "@/lib/types/api/chapter";
import React, { FC, FormEventHandler, useState } from 'react';
import { shallow } from "zustand/shallow";
import { ChapterContext } from '../../context/useChapterContext';
import { debounce } from 'lodash-es';

export type TStreamedChunkProps = {
  index: number;
  content: string;
  mapping: TChapterChunkMetaData;
  chunkId: string
};

const StreamedChunk: FC<TStreamedChunkProps> = ({ content = '', index = 0, mapping, chunkId }) => {
  const [chunkContent, setChunkContent] = React.useState<string>(content);
  const [context, updateContext] = useState(content)
  const { chunk_type, topic_mapping } = mapping
  const { topic_id = '', topic_point_id = '' } = topic_mapping
  const { currentPointerId, currentTopicId, updateCurrentId, updateCurrentChunkId } = React.useContext(ChapterContext)
  const { updateChunkContent } = useStreamedChunksStore()
  const getChunkStyle = () => {
    if (topic_id == currentTopicId && topic_point_id == currentPointerId) {
      if (chunk_type == 'leader') {
        return { lineHeight: '20px', height: '20px', outline: 'none', border: '1px solid #a43442', background: '#582242' }
      } else {
        return { lineHeight: '20px', height: '20px', outline: 'none', border: '1px solid #8b47cc', background: '#50266d' }
      }
    }
    return { outline: 'none' }
  }
  const changeHandler = (topicId: string, pointerId: string) => {
    updateCurrentChunkId(chunkId)
    updateCurrentId(topicId, pointerId)
  }
  const onInput = (e: any) => {
    updateContext(e.target.innerText)
  }
  const onblur = () => {
    if (context == chunkContent) return;
     updateChunkContent(context, index)
    setChunkContent(context)
  }
  React.useEffect(() => {
    const unSub = useStreamedChunksStore.subscribe(
      (state) => ({
        currentChunk: state.currentChunk,
        currentIndex: state.currentIndex,
      }),
      (cur) => {
        if (
          cur.currentIndex === index &&
          cur.currentChunk &&
          cur.currentChunk.isStreaming
        ) {
          if (
            cur.currentChunk.content &&
            cur.currentChunk.content !== chunkContent
          ) {
            console.log(cur.currentChunk, '监听到的变化')
            setChunkContent(cur.currentChunk?.content!);
            updateContext(cur?.currentChunk?.content!);
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
  }, [chunkContent, index]);
  return <span  id={chunkId} style={getChunkStyle()} onInput={onInput} onBlur={onblur} onClick={() => changeHandler(topic_id, topic_point_id)} contentEditable suppressContentEditableWarning >{chunkContent}</span>;
};

export default React.memo(StreamedChunk);

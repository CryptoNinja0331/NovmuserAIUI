import useStreamedChunksStore from "@/lib/store/chapterChunks/streamedChunksStore";
import { TTopicMapping } from "@/lib/types/api/chapter";
import React, { FC, FocusEventHandler, FormEventHandler, useState } from 'react';
import { shallow } from "zustand/shallow";
import { ChapterContext } from '../../context/useChapterContext';

export type TStreamedChunkProps = {
  index: number;
  content: string;
  mapping: TTopicMapping
};

const StreamedChunk: FC<TStreamedChunkProps> = ({ content= '', index= 0, mapping= {}}) => {
  const [chunkContent, setChunkContent] = React.useState<string>(content);
  const [context, updateContext] = useState('')
  const { chunk_type, topic_mapping = {} } = mapping
  const  { topic_id = '', topic_point_id = '' } = topic_mapping
  const { currentPointerId, currentTopicId, updateCurrentId } = React.useContext(ChapterContext)
  const { updateChunkContent } = useStreamedChunksStore()
  const getChunkStyle = () => {
    if (topic_id == currentTopicId && topic_point_id == currentPointerId) {
      if (chunk_type == 'leader') {
        return { outline: 'none', border: '1px solid #a43442', background: '#582242' }
      } else {
        return { outline: 'none', border: '1px solid #8b47cc', background: '#50266d' }
      }
    }
    return { }
  }
  const canEdit = () => {
    return currentTopicId == topic_id && currentPointerId == topic_point_id
  }
  const changeHandler = (topicId: string, pointerId: string) => {
    updateCurrentId(topicId, pointerId)
  }
  const onInput = (e: FormEventHandler) => {
    updateContext(e.target.innerText)
  }
  const onblur = () => {
    console.log(context)
    updateChunkContent(context, index)
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
            setChunkContent(cur.currentChunk?.content!);
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
  return <span style={getChunkStyle()} onInput={onInput} onBlur={onblur} onClick={() => changeHandler(topic_id, topic_point_id)} contentEditable={canEdit()} suppressContentEditableWarning>{chunkContent}</span>;
};

export default React.memo(StreamedChunk);

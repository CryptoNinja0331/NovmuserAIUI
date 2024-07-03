import useStreamedChunksStore from "@/lib/store/chapterChunks/streamedChunksStore";
import React, { FC } from "react";
import { shallow } from "zustand/shallow";

export type TStreamedChunkProps = {
  index: number;
  content: string;
};

const StreamedChunk: FC<TStreamedChunkProps> = (props) => {
  const [chunkContent, setChunkContent] = React.useState<string>(props.content);

  React.useEffect(() => {
    const unSub = useStreamedChunksStore.subscribe(
      (state) => ({
        currentChunk: state.currentChunk,
        currentIndex: state.currentIndex,
      }),
      (cur) => {
        if (
          cur.currentIndex === props.index &&
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
  }, [chunkContent, props.index]);

  return <div>{chunkContent}</div>;
};

export default React.memo(StreamedChunk);

import React, { useContext, useEffect, useRef, useState } from "react";
import { TChapterChunkMetaData } from "@/lib/types/api/chapter";
import useStreamedChunksStore from "@/lib/store/chapterChunks/streamedChunksStore";
import { TStreamedChunk } from "@/lib/store/chapterChunks/streamedChunksStore";
import { getUUid } from "@/lib/utils";
import { ChapterContext } from "../../context/useChapterContext";
interface ISplitChunkProps {
	chunkId: string;
	mapping: TChapterChunkMetaData;
	index: number; // current chunk isAfter chunk index
}

/**
 * @description
 * @param mapping
 * @param index
 * @constructor
 */
const SplitChunk = ({ mapping, index, chunkId }: ISplitChunkProps) => {
  const { topic_mapping } = mapping;
  const { topic_id = "", topic_point_id = "" } = topic_mapping;
  const [chunkContent, updateChunkContent] = useState("");
  const { appendChunkWithContent } = useStreamedChunksStore();
  const { updateCurrentId, updateCurrentChunkId } = useContext(ChapterContext);
  const [style, updateStyle] = useState<React.CSSProperties>({});
  const [uuid] = useState<string>(getUUid());
  const onBlur = () => {
    updateStyle({});
    if (!chunkContent) return;
    const chunk: TStreamedChunk = {
      id: uuid,
      content: chunkContent,
      isStreaming: false,
      has_persisted: false,
      metadata: {
        topic_mapping: {
          topic_id,
          topic_point_id,
        },
        chunk_type: "follower",
        generate_from: "human",
      },
    };
    const element = document?.getElementById(uuid + "split");
    if (element && element.innerHTML) {
      element.innerHTML = "";
    }
    appendChunkWithContent(chunk, index).then((_) => {
      updateChunkContent("");
      updateCurrentId(topic_id, topic_point_id);
    });
  };
  const onfocus = () => {
	  updateCurrentId(topic_id, topic_point_id)
	  updateCurrentChunkId(chunkId)
	  updateStyle({
		  borderBottom: '1px solid #fff',
	  })
  };
  const onInput = (e: any) => {
    updateChunkContent(e.target.innerText);
  };
  return (
    <span
      className="add-split"
      id={uuid + "split"}
      onFocus={onfocus}
      contentEditable
      onInput={onInput}
      onBlur={onBlur}
      style={style}
      suppressContentEditableWarning
    ></span>
  );
};

export default SplitChunk;

import React, { useContext, useEffect, useRef, useState } from 'react';
import { TTopicMapping } from "@/lib/types/api/chapter";
import useStreamedChunksStore from '@/lib/store/chapterChunks/streamedChunksStore';
import { TStreamedChunk } from '@/lib/store/chapterChunks/streamedChunksStore';
import { getUUid } from '@/lib/utils';
import { ChapterContext } from '../../context/useChapterContext';
interface ISplitChunkProps {
	mapping: TTopicMapping;
	index: number; // current chunk isAfter chunk index
}

/**
 * @description
 * @param mapping
 * @param index
 * @constructor
 */
const SplitChunk = ({ mapping = {}, index }: ISplitChunkProps) => {
	const [editable, updateEditable] = useState(false)
	const { topic_id = '', topic_point_id = ''} = mapping.topic_mapping
	const [chunkContent, updateChunkContent ] = useState('')
	const { appendChunkWithContent } = useStreamedChunksStore()
	const { updateCurrentId } = useContext(ChapterContext)
	const uuid = getUUid()
	const addChunk = () => {
		updateEditable(true)
	}
	const onBlur = () => {
		updateEditable(false)
		if (!chunkContent) return;
		const chunk: TStreamedChunk = {
			content: chunkContent,
			isStreaming: false,
			metadata: {
				topic_mapping: {
					topic_id,
					topic_point_id
				},
				chunk_type: 'follower',
				generate_from: 'human',
			}
		}
		appendChunkWithContent(chunk, index)
		updateChunkContent('')
		document.getElementById(uuid).innerHTML = ''
		console.log(topic_id, topic_point_id, 'ssss')
		updateCurrentId(topic_id, topic_point_id)
	}

	const onInput = e => {
		updateChunkContent(e.target.innerText)
	}
	return <span id={uuid} contentEditable={editable} onInput={onInput} onClick={addChunk} onBlur={onBlur} style={{ display: 'inline-block',  outline: 'none', minWidth: '5px', height: '20px' }} suppressContentEditableWarning></span>
}

export default SplitChunk

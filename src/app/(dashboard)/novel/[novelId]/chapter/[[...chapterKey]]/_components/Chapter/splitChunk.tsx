import React, { useContext, useEffect, useRef, useState } from 'react';
import { TChapterChunkMetaData } from "@/lib/types/api/chapter";
import useStreamedChunksStore from '@/lib/store/chapterChunks/streamedChunksStore';
import { TStreamedChunk } from '@/lib/store/chapterChunks/streamedChunksStore';
import { getUUid } from '@/lib/utils';
import { ChapterContext } from '../../context/useChapterContext';
interface ISplitChunkProps {
	mapping: TChapterChunkMetaData;
	index: number; // current chunk isAfter chunk index
}

/**
 * @description
 * @param mapping
 * @param index
 * @constructor
 */
const defaultStyle = {
	cursor: 'text',
	display: 'inline-block',
	outline: 'none',
	minWidth: '10px',
	lineHeight: '22px',
	minHeight: '24px',
	verticalAlign: 'bottom'
}
const SplitChunk = ({ mapping, index }: ISplitChunkProps) => {
	const { topic_mapping } = mapping
	const { topic_id = '', topic_point_id = '' } = topic_mapping
	const [chunkContent, updateChunkContent] = useState('')
	const { appendChunkWithContent } = useStreamedChunksStore()
	const { updateCurrentId } = useContext(ChapterContext)
	const [style, updateStyle ] = useState<React.CSSProperties>(defaultStyle)
	const [uuid] = useState<string>(getUUid())
	const onBlur = () => {
		updateStyle(defaultStyle)
		if (!chunkContent) return;
		const chunk: TStreamedChunk = {
			id: uuid,
			content: chunkContent,
			isStreaming: false,
			has_persisted: false,
			metadata: {
				topic_mapping: {
					topic_id,
					topic_point_id
				},
				chunk_type: 'follower',
				generate_from: 'human',
			}
		}
		document.getElementById(uuid + 'split').innerHTML = ''
		appendChunkWithContent(chunk, index).then(_ => {
			updateChunkContent('')
			updateCurrentId(topic_id, topic_point_id)
		})
	}
	const onfocus = () => {
		updateStyle({
			...defaultStyle,
			borderBottom: '1px solid #fff',
		})
	}
	const onInput = (e: any) => {
		updateChunkContent(e.target.innerText)
	}
	return <span id={uuid + 'split'} onFocus={onfocus} contentEditable onInput={onInput}  onBlur={onBlur} style={style} suppressContentEditableWarning></span>
}

export default SplitChunk

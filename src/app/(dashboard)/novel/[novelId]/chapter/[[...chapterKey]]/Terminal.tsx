'use client';

import NextChunkTest from './NextChunkTest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback, useRef } from 'react';
import { IoMdEye } from 'react-icons/io';
import { Checkbox } from "@/components/ui/checkbox";
import SimpleBar from 'simplebar-react';
import { useAuth } from "@clerk/nextjs";

const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
};

const Terminal = ({ chapterKey, topicDetails }) => {
    const [streamedText, setStreamedText] = useState({ text: '', data: null });
    const [nextPointChecked, setNextPointChecked] = useState(true);
    const [userFeedback, setUserFeedback] = useState('');
    const [selectedChunkId, setSelectedChunkId] = useState(null);
    const [generatedChunks, setGeneratedChunks] = useState({});
    const [removeCurrentChunk, setRemoveCurrentChunk] = useState(false);
    const { getToken } = useAuth();
    const contentEditableRef = useRef(null);
    const getColor = (chunkType) => {
        if (chunkType === 'leader') {
            return '#531E41';
        } else if (chunkType === 'follower') {
            return '#4D216C';
        } else {
            return 'inherit';
        }
    };

    const concatenatedContent = topicDetails?.details?.chapter_chunks.map((chunk) => {
        const { chunk_content, metadata } = chunk;
        const { chunk_type } = metadata || {};
        const chunkId = chunk.id;
        const generatedText = generatedChunks[chunkId] || chunk_content;

        return {
            text: generatedText,
            color: getColor(chunk_type),
            chunkId: chunkId
        };
    });

    const editableContent = concatenatedContent.map(chunk => chunk.text).join(' ');



    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const startContainer = range.startContainer.parentNode;
            const endContainer = range.endContainer.parentNode;

            if (startContainer.dataset.chunkId) {
                setSelectedChunkId(startContainer.dataset.chunkId);
            } else if (endContainer.dataset.chunkId) {
                setSelectedChunkId(endContainer.dataset.chunkId);
            }
        }
    };

    useEffect(() => {
        document.addEventListener('selectionchange', handleTextSelection);
        return () => {
            document.removeEventListener('selectionchange', handleTextSelection);
        };
    }, []);

    const replaceChunkText = (chunkId, newText) => {
        setGeneratedChunks((prevChunks) => ({
            ...prevChunks,
            [chunkId]: newText
        }));
    };

    const saveContent = useCallback(
        debounce(async (newContent) => {
            if (!selectedChunkId) return;
            const userId = await getToken({ template: "UserToken" });
            const savePayload = {
                chunk_id: selectedChunkId,
                chunk_content: newContent
            };
            await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/update/chunk`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userId}`,

                    },
                    body: JSON.stringify(savePayload),
                }
            );
        }, 2000), [selectedChunkId, getToken, chapterKey]
    );

    const handleContentChange = (e) => {
        const newText = e.target.innerText;



        saveContent(newText);
    };








    return (
        <div className="w-full relative h-full border-r border-input p-3">
            <SimpleBar style={{ maxHeight: '60vh' }}>
                <div>
                    <div

                        contentEditable
                        onInput={handleContentChange}
                        suppressContentEditableWarning={true}
                        style={{
                            width: '100%',
                            borderRadius: '4px',
                            whiteSpace: 'pre-wrap',
                            outline: 'none'
                        }}
                    >
                        {concatenatedContent.map((chunk, index) => (
                            <span
                                key={index}
                                data-chunk-id={chunk.chunkId}
                                style={{ backgroundColor: chunk.color }}
                            >
                                {chunk.text}{' '}
                            </span>
                        ))}
                    </div>
                    <div
                        style={{
                            backgroundColor: getColor(streamedText.data?.meta_data?.chunk_type),
                            color: streamedText.data ? 'white' : 'inherit',
                            padding: streamedText.data ? '2px' : '0',
                            borderRadius: streamedText.data ? '0.2rem' : '0',
                            marginTop: '1rem'
                        }}
                    >
                        {streamedText?.text}
                    </div>
                </div>
            </SimpleBar>

            <div className="bg-[#414481] absolute bottom-[30px] p-3 w-[70%] mx-auto rounded-xl">
                <div className="my-2">
                    <Input onChange={(e) => setUserFeedback(e.target.value)} value={userFeedback} className="text-[1.1rem] text-white h-[3.5rem]" placeholder="Enter your idea here" />
                </div>
                <div className="flex justify-between gap-8 items-center py-2">
                    <div className="w-1/2 flex justify-between items-center">
                        <Button className="flex gap-1 items-center bg-[#1A1647] hover:bg-background hover:text-white" variant="outline">
                            <IoMdEye className="" />
                            <h1>Trace chunks</h1>
                        </Button>
                        <div className="flex items-center gap-2">
                            <Checkbox checked={nextPointChecked} onCheckedChange={() => setNextPointChecked(!nextPointChecked)} id="terms" />
                            Link to next point
                        </div>
                    </div>
                    <NextChunkTest
                        setRemoveCurrentChunk={setRemoveCurrentChunk}
                        userFeedback={userFeedback}
                        topicDetails={topicDetails}
                        nextPointChecked={nextPointChecked}
                        setNextPointChecked={setNextPointChecked}
                        streamedText={streamedText}
                        setStreamedText={setStreamedText}
                        chapterKey={chapterKey}
                        selectedChunkId={selectedChunkId}
                        replaceChunkText={replaceChunkText}
                    />
                </div>
            </div>
        </div>
    );
};

export default Terminal;

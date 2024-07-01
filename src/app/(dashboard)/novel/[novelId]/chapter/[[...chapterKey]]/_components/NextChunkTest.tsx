'use client';
import { Button } from "@/components/ui/button";
import { customRevalidateTag } from "@/lib/actions/revalidateTag";
import { useAppDispatch } from "@/lib/hooks";
import { addChunkData } from "@/lib/store/features/chunkSlice";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRobot } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "sonner";

interface NextChunkTestProps {
    chapterKey: string;
    setStreamedText: React.Dispatch<React.SetStateAction<string>>;
    streamedText: string,
    nextPointChecked: boolean
    setNextPointChecked: React.Dispatch<React.SetStateAction<boolean>>;
    selectedChunkId: string;
    userFeedback: string;
    replaceChunkText: (chunkId: string, newText: string) => void;
    topicDetails: any;
}




const NextChunkTest = ({ chapterKey, setStreamedText, streamedText, setNextPointChecked, nextPointChecked, selectedChunkId, userFeedback, replaceChunkText, topicDetails }: NextChunkTestProps) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [fullStreamedText, setFullStreamedText] = useState('');
    const [regenerateLoading, setRegenrateLoading] = useState(false);
    const [doneEventData, setDoneEventData] = useState<any>(null);

    const { getToken } = useAuth();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const latestChunk = topicDetails?.details?.chapter_chunks[topicDetails?.details?.chapter_chunks.length - 1];

    const handleNextChunk = async () => {
        setIsStreaming(true);
        const userId = await getToken({ template: "UserToken" });
        const payload = topicDetails?.details?.chapter_chunks?.length === 0 ? {
            "is_first_chunk": true,
            "user_feedback": "string",
            "chunk_type": "leader"
        } : {
            "prev_chunk": {
                "id": latestChunk?.id,
                "metadata": {
                    "topic_mapping": {
                        "topic_id": latestChunk?.metadata?.topic_mapping?.topic_id,
                        "topic_point_id": latestChunk?.metadata?.topic_mapping?.topic_point_id
                    },
                    "chunk_type": latestChunk?.metadata.chunk_type,
                    "generate_from": latestChunk?.metadata.generate_from
                }
            },
            "is_first_chunk": false,
            "user_feedback": "string",
            "chunk_type": "follower"
        };

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk_stream`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userId}`,
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.body) {
            console.error("ReadableStream not supported");
            setIsStreaming(false);
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const processDataChunk = async (dataChunk) => {
            try {
                let buffer = "";
                const lines = dataChunk.trim().split('\n');
                for (const line of lines) {
                    if (line.startsWith('data:') && line.endsWith('}')) {
                        const data = JSON.parse(line.substring(5));
                        if (data.content) {
                            buffer += data.content;
                        }
                        if (data.is_final) {
                            setDoneEventData(data);
                            dispatch(addChunkData(data));
                            setStreamedText((prevState) => ({
                                ...prevState,
                                data: data
                            }));

                            let payload = {
                                "cur_chunk": {
                                    "metadata": {
                                        "topic_mapping": {
                                            "topic_id": data.meta_data.cur_topic_id,
                                            "topic_point_id": data.meta_data.cur_topic_point_id
                                        },
                                        "chunk_type": data.meta_data.chunk_type,
                                        "generate_from": "ai"
                                    },
                                    "chunk_content": data.meta_data.whole_content
                                },
                            };

                            if (data.meta_data.chunk_type === 'follower') {
                                payload = {
                                    "prev_chunk": {
                                        "id": latestChunk?.id,
                                        "metadata": {
                                            "topic_mapping": {
                                                "topic_id": latestChunk?.metadata?.topic_mapping?.topic_id,
                                                "topic_point_id": latestChunk?.metadata?.topic_mapping?.topic_point_id
                                            },
                                            "chunk_type": latestChunk?.metadata.chunk_type,
                                            "generate_from": latestChunk?.metadata.generate_from
                                        }
                                    },
                                    ...payload
                                };
                            }

                            const saveResponse = await fetch(
                                `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk`,
                                {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${userId}`,
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Credentials': 'true'
                                    },
                                    body: JSON.stringify(payload),
                                }
                            );
                            if (saveResponse.ok) {
                                const responseData = await saveResponse.json();
                                customRevalidateTag('chapterInfo');
                            } else {
                                console.error("Failed to save changes");
                            }
                        }
                    } else {
                        console.error('Invalid JSON format in data chunk, skipping line:', line);
                    }
                }

                setFullStreamedText(buffer);

                const words = buffer.split(/\s+/);
                for (let i = 0; i < words.length; i++) {
                    setTimeout(() => {
                        setStreamedText((prevState) => ({
                            ...prevState,
                            text: prevState.text + words[i] + " "
                        }));
                    }, i * 300);
                }

                buffer = "";
            } catch (error) {
                console.error('Error processing data chunk:', error);
            }
        };

        const streamProcessor = async () => {
            let done = false;
            while (!done) {
                const { value, done: streamDone } = await reader.read();
                done = streamDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: !done });
                    await processDataChunk(chunk);
                }
            }
            setIsStreaming(false);
        };

        await streamProcessor();
    };

    const handleRegenerate = async () => {
        setRegenrateLoading(true)
        if (!userFeedback || !selectedChunkId) {
            setRegenrateLoading(false)

            toast.error('Select the chunk or input your feedback');
            return;
        }
        const userId = await getToken({ template: "UserToken" });
        const payload = {
            chunk_id: selectedChunkId,
            user_feedback: userFeedback
        };

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk_stream/re_generate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userId}`,
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.body) {
            console.error("ReadableStream not supported");
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const processDataChunk = (dataChunk: string) => {
            try {
                const lines = dataChunk.trim().split('\n');
                let newText = '';
                lines.forEach((line) => {
                    if (line.startsWith('data:') && line.endsWith('}')) {
                        const data = JSON.parse(line.substring(5));
                        if (data.content) {
                            newText += data.content;
                            setRegenrateLoading(false)

                        }
                    } else {
                        console.error('Invalid JSON format in data chunk, skipping line:', line);
                    }
                });
                replaceChunkText(selectedChunkId, newText);
                // After replacing the text, patch the API
                const savePayload = {
                    chunk_id: selectedChunkId,
                    chunk_content: newText
                };
                fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userId}`,
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': 'true'
                        },
                        body: JSON.stringify(savePayload),
                    }
                ).then(saveResponse => {
                    if (saveResponse.ok) {
                        saveResponse.json().then(responseData => {
                            customRevalidateTag('chapterInfo');
                        });
                    } else {
                        console.error("Failed to save changes");
                    }
                });
            } catch (error) {
                console.error('Error processing data chunk:', error);
            }
        };

        let done = false;
        while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;
            if (value) {
                const chunk = decoder.decode(value, { stream: !done });
                processDataChunk(chunk);
            }
        }
    };

    return (
        <div>
            <div className="w-1/2 flex gap-3 justify-between items-center">
                <Button onClick={handleRegenerate} className="flex gap-1 bg-[#1A1647] items-center hover:bg-background hover:text-white" variant="outline">
                    {regenerateLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            PLEASE WAIT
                        </>
                    ) : (
                        <>
                            <GrPowerReset className="mt-[5px]" /> Re-generate
                        </>
                    )}
                </Button>
                <Button onClick={handleNextChunk} className="button-gradient-2 z-[49] flex gap-1 items-center">
                    {isStreaming ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            PLEASE WAIT
                        </>
                    ) : (
                        <>
                            <FaRobot className='text-xl' /> Next Chunk
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default NextChunkTest;

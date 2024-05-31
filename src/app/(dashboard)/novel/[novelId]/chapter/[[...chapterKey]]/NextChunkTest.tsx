'use client';;
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { addChunkData } from "@/lib/store/features/chunkSlice";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";

interface NextChunkTestProps {
    chapterKey: string;
    setStreamedText: React.Dispatch<React.SetStateAction<string>>;
    streamedText: string,
    nextPointChecked: boolean
    setNextPointChecked: React.Dispatch<React.SetStateAction<boolean>>;

}
const NextChunkTest = ({ chapterKey, setStreamedText, streamedText, setNextPointChecked, nextPointChecked }: NextChunkTestProps) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [fullStreamedText, setFullStreamedText] = useState('');
    const [doneEventData, setDoneEventData] = useState<any>(null);
    const [isFirstChunk, setIsFirstChunk] = useState(true);

    const { getToken } = useAuth();
    const dispatch = useAppDispatch();
    const handleNextChunk = async () => {
        setIsStreaming(true);
        const userId = await getToken({ template: "UserToken" });
        const payload = isFirstChunk ? {
            "is_first_chunk": true,
            "user_feedback": "string",
            "chunk_type": "leader"
        } : {
            "prev_chunk": {
                "id": doneEventData.meta_data.cur_chunk_id,
                "metadata": {
                    "topic_mapping": {
                        "topic_id": doneEventData.meta_data.cur_topic_id,
                        "topic_point_id": doneEventData.meta_data.cur_topic_point_id
                    },
                    "chunk_type": doneEventData.meta_data.chunk_type,
                    "generate_from": "ai"
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

        const streamProcessor = {
            async start() {
                let done = false;
                while (!done) {
                    const { value, done: streamDone } = await reader.read();
                    done = streamDone;
                    if (value) {
                        const chunk = decoder.decode(value, { stream: !done });
                        processDataChunk(chunk);
                    }
                }
                setIsStreaming(false);
            },
        };

        const processDataChunk = (dataChunk: string) => {
            try {
                let buffer = "";

                const lines = dataChunk.trim().split('\n');

                lines.forEach((line) => {


                    if (line.startsWith('data:') && line.endsWith('}')) {
                        const data = JSON.parse(line.substring(5));
                        if (data.content) {
                            buffer += data.content;
                        }
                        if (data.is_final) {
                            setDoneEventData(data);
                            dispatch(addChunkData(data));
                            // setAllChunkData((prevChunkData: any) => [...prevChunkData, data]);
                        }


                    } else {
                        console.error('Invalid JSON format in data chunk, skipping line:', line);
                    }
                });

                setFullStreamedText(buffer);
                const words = buffer.split(/\s+/);
                console.log(words, 'need');
                for (let i = 0; i < words.length; i++) {
                    setTimeout(() => {
                        setStreamedText((prevText) => prevText + words[i] + " ");
                    }, i * 300);
                }

                buffer = "";


            } catch (error) {
                console.error('Error processing data chunk:', error);
            }
        };


        streamProcessor.start();
    };



    useEffect(() => {
        async function saveChunk() {
            const userId = await getToken({ template: "UserToken" });
            const payload = {
                "cur_chunk": {
                    "metadata": {
                        "topic_mapping": {
                            "topic_id": doneEventData.meta_data.cur_topic_id,
                            "topic_point_id": doneEventData.meta_data.cur_topic_point_id
                        },
                        "chunk_type": "leader",
                        "generate_from": "ai"
                    },
                    "chunk_content": fullStreamedText
                },


            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userId}`,
                    },
                    body: JSON.stringify(payload),
                }
            );
            if (response.ok) {
                const responseData = await response.json();

                console.log(responseData.data);
            } else {
                console.error("Failed to save changes");
            }
        }

        if (doneEventData) {
            saveChunk()
            setIsFirstChunk(false);
        }
    }, [chapterKey, doneEventData, fullStreamedText, getToken])




    return (
        <div>
            <div className="w-1/2 flex gap-3 justify-between items-center">
                <Button className="flex gap-1 bg-[#1A1647] items-center hover:bg-background hover:text-white" variant="outline">
                    <GrPowerReset className="mt-[5px" /> Re-generate
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

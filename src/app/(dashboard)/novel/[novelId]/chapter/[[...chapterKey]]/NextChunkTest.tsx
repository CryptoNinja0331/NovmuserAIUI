'use client';;
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
interface NextChunkTestProps {
    chapterKey: string;
    setStreamedText: React.Dispatch<React.SetStateAction<string>>;
}
const NextChunkTest = ({ chapterKey, setStreamedText }: NextChunkTestProps) => {
    const [isStreaming, setIsStreaming] = useState(false);

    const [doneEventData, setDoneEventData] = useState<any>(null);
    const { getToken } = useAuth();

    const handleNextChunk = async () => {
        setIsStreaming(true);
        const userId = await getToken({ template: "UserToken" });
        const payload = {
            "is_first_chunk": true,
            "user_feedback": "string",
            "chunk_type": "leader"
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
                        }


                    } else {
                        console.error('Invalid JSON format in data chunk, skipping line:', line);
                    }
                });

                const words = buffer.split(/\s+/);
                words.forEach((word) => {
                    setTimeout(() => {
                        setStreamedText((prevText) => prevText + word + " ");
                    }, words.indexOf(word) * 300);
                });

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

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chunk`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userId}`,
                    },
                    body: JSON.stringify({}),
                }
            );
        }
    }, [])







    return (
        <div>
            <div className="w-1/2 flex justify-between items-center">

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

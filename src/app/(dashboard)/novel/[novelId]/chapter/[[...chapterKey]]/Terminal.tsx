'use client';

import NextChunkTest from './NextChunkTest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { IoMdEye } from 'react-icons/io';
import { Checkbox } from "@/components/ui/checkbox";
import SimpleBar from 'simplebar-react';

const Terminal = ({ chapterKey, topicDetails }: { chapterKey: string }) => {
    const [streamedText, setStreamedText] = useState({
        text: '',
        data: null
    });
    const [nextPointChecked, setNextPointChecked] = useState(true);
    console.log(topicDetails, 'topic details');
    console.log(topicDetails?.details?.chapter_chunks, 'need this');

    const concatenatedContent = topicDetails?.details?.chapter_chunks.map((chunk) => {
        const { chunk_content, metadata } = chunk;
        const { chunk_type } = metadata || {};

        const getColor = () => {
            if (chunk_type === 'leader') {
                return '#531E41';
            } else if (chunk_type === 'follower') {
                return '#4D216C';
            } else {
                return 'inherit';
            }
        };

        const color = getColor();

        return (
            <span key={chunk.id} style={{ backgroundColor: color }}>
                {chunk_content}
            </span>
        );
    });

    const getBackgroundColor = (chunkType) => {
        if (chunkType === 'leader') {
            return '#531E41';
        } else if (chunkType === 'follower') {
            return '#4D216C';
        } else {
            return 'transparent';
        }
    };

    return (
        <div className="w-full relative h-full border-r border-input p-3">
            <SimpleBar style={{ maxHeight: '60vh' }}>
                <div>
                    <div>{concatenatedContent}</div>
                    <div
                        style={{
                            backgroundColor: getBackgroundColor(streamedText.data?.meta_data?.chunk_type),
                            color: streamedText.data ? 'white' : 'inherit',
                            padding: streamedText.data ? '2px' : '0',
                            borderRadius: streamedText.data ? '0.2rem' : '0',
                            marginTop: '1rem' // Added margin to separate streamed text
                        }}
                    >
                        {streamedText?.text}
                    </div>
                </div>
            </SimpleBar>

            <div className="bg-[#414481] absolute bottom-[30px] p-3 w-[70%] mx-auto rounded-xl">
                <div className="my-2">
                    <Input className="text-[1.1rem] text-white h-[3.5rem]" placeholder="Enter your idea here" />
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
                        topicDetails={topicDetails}
                        nextPointChecked={nextPointChecked}
                        setNextPointChecked={setNextPointChecked}
                        streamedText={streamedText}
                        setStreamedText={setStreamedText}
                        chapterKey={chapterKey}
                    />
                </div>
            </div>
        </div>
    );
};

export default Terminal;

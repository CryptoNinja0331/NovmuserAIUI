'use client'

import NextChunkTest from './NextChunkTest';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { IoIosCheckbox, IoMdEye } from 'react-icons/io';

const Terminal = ({ chapterKey }: { chapterKey: string }) => {
    const [streamedText, setStreamedText] = useState("");

    return (
        <div className="w-full relative h-full border-r border-input p-3">
            <div>{streamedText}</div>
            <div className="bg-[#414481] absolute  bottom-[30px] p-3 w-[70%] mx-auto rounded-xl">
                <div className="my-2">
                    <Input className="text-[1.1rem] text-white h-[3.5rem]" placeholder="Enter your idea here" />

                </div>
                <div className="flex justify-between gap-8 items-center py-2">
                    <div className="w-1/2 flex justify-between items-center">
                        <Button className="flex gap-1 items-center bg-[#1A1647] hover:bg-background hover:text-white" variant="outline">
                            <IoMdEye className="" />

                            <h1>   Trace chunks</h1>

                        </Button>

                        <div className="flex items-center gap-2">

                            <IoIosCheckbox className="text-xl mt-[5px]" />
                            Link to next point</div>
                    </div>

                    <NextChunkTest setStreamedText={setStreamedText} chapterKey={chapterKey} />

                </div>
            </div>
        </div>
    );
};

export default Terminal;
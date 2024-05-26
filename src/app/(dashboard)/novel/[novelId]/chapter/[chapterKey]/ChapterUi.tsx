'use client';

import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FaRobot } from "react-icons/fa6";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { RxCross2 } from "react-icons/rx";
import { IoAddCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface Topic {
    name: string;
    abstract: string;
    topic_points: string[];
}

interface FormValues {
    topics: Topic[];
}

interface ChapterUiProps {
    novelId: string;
    chapterKey: string;
}

const ChapterUi = ({ novelId, chapterKey }: ChapterUiProps) => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [topicsData, setTopicsData] = useState<{ topics: Topic[] } | null>(null);
    const { control, handleSubmit, reset } = useForm<FormValues>();

    const handleAiGeneration = async () => {
        setLoading(true);
        const token = await getToken({ template: "UserToken" });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/topic/${novelId}/${chapterKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.ok) {
            const responseData = await response.json();
            setLoading(false);
            setTopicsData(responseData.data);
            console.log(responseData.data);

            // Populate form fields with response data using reset
            const topics = responseData.data.topics.map((topic: Topic) => ({
                name: topic.name,
                abstract: topic.abstract,
                topic_points: topic.topic_points.map(point => point),
            }));
            reset({ topics });
        } else {
            console.error("Failed to initialize novel");
            setLoading(false);
        }
    };

    const handleDeleteTopic = (index: number) => {
        const updatedTopics = topicsData?.topics.filter((_, i) => i !== index) || [];
        setTopicsData({ topics: updatedTopics });
        reset({ topics: updatedTopics });
    };

    const handleDeleteTopicPoint = (topicIndex: number, pointIndex: number) => {
        const updatedTopics = topicsData?.topics.map((topic, i) => {
            if (i === topicIndex) {
                const updatedPoints = topic.topic_points.filter((_, j) => j !== pointIndex);
                return { ...topic, topic_points: updatedPoints };
            }
            return topic;
        }) || [];
        setTopicsData({ topics: updatedTopics });
        reset({ topics: updatedTopics });
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const token = await getToken({ template: "UserToken" });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/edit/${chapterKey}/topics`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData.data);
        } else {
            console.error("Failed to save changes");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-bluish text-center flex gap-2 mx-auto mt-3 hover:bg-background hover:text-white">
                    Initialize Topics
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[85vw] bg-[#150F2D] text-white">
                <SimpleBar style={{ maxHeight: '85vh' }}>
                    <form id="topic-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-1/2 relative p-[2.5rem]">
                        {topicsData ? (
                            topicsData.topics.map((topic, topicIndex) => (
                                <div key={topicIndex}>
                                    <div className="bg-[#0C0C0D] border relative border-input rounded-md p-4">
                                        <IoAddCircle className="text-white text-2xl absolute top-[50%] left-[-30px]" />
                                        <div className="mb-4 flex items-center justify-between">
                                            <h1>Topic:</h1>
                                            <Controller
                                                name={`topics.${topicIndex}.name`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        className="bg-[#150F2D] p-2 focus:outline-0 rounded-sm text-white w-full"
                                                    />
                                                )}
                                            />
                                            <RxCross2 className="cursor-pointer" onClick={() => handleDeleteTopic(topicIndex)} />
                                        </div>
                                        <h1 className="mb-2">Abstract</h1>
                                        <div className="bg-[#150F2D] rounded-md p-3">
                                            <Controller
                                                name={`topics.${topicIndex}.abstract`}
                                                control={control}
                                                render={({ field }) => (
                                                    <textarea
                                                        {...field}
                                                        className="bg-[#150F2D] p-2 rounded-sm text-white w-full"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {topic.topic_points.map((point, pointIndex) => (
                                            <div key={pointIndex} className="flex justify-end">
                                                <div className="bg-[#0C0C0D] w-[70%] point border relative topics-point border-input rounded-md p-4">
                                                    <IoAddCircle className="text-white text-2xl absolute top-[50%] left-[-30px]" />
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <h1>Topics point</h1>
                                                        <RxCross2 className="cursor-pointer" onClick={() => handleDeleteTopicPoint(topicIndex, pointIndex)} />
                                                    </div>
                                                    <div className="bg-[#150F2D] rounded-md p-3">
                                                        <Controller
                                                            name={`topics.${topicIndex}.topic_points.${pointIndex}`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <input
                                                                    {...field}
                                                                    className="bg-[#150F2D] p-2 rounded-sm text-white w-full"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <><div className='bg-[#0C0C0D] relative border topics border-input rounded-md p-4'>
                                <IoAddCircle className='text-white text-2xl absolute top-[50%] left-[-30px]' />
                                <div className='mb-4 flex items-start justify-between'>
                                    <h1>Topics: this is topics</h1>
                                    <RxCross2 className='cursor-pointer' />
                                </div>
                                <h1 className='mb-2'>Abstract</h1>
                                <div className='bg-[#150F2D] rounded-md p-3'>
                                    <h1>this is abstract</h1>
                                    <h1>this is abstract</h1>
                                    <h1>this is abstract</h1>
                                    <h1>this is abstract</h1>
                                </div>
                            </div>
                                <div className='flex justify-end'>
                                    <div className='bg-[#0C0C0D] w-[70%] point border relative topics-point border-input rounded-md p-4'>
                                        <IoAddCircle className='text-white text-2xl absolute top-[50%] left-[-30px]' />
                                        <div className='mb-4 flex items-start justify-between'>
                                            <h1>Topics point</h1>
                                            <RxCross2 className='cursor-pointer' />
                                        </div>
                                        <div className='bg-[#150F2D] rounded-md p-3'>
                                            <h1>this is content of the topic</h1>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                    </form>
                </SimpleBar>
                <div className="flex items-center justify-end gap-4">
                    <Button form="topic-form" type="submit" className="uppercase hover:bg-background hover:text-white" variant="outline">
                        Save changes
                    </Button>
                    <Button onClick={handleAiGeneration} className='button-gradient-2 z-[49] flex gap-1 items-center' disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                PLEASE WAIT
                            </>
                        ) : (
                            <>
                                <FaRobot className='text-xl' />
                                Try AI generation
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChapterUi;
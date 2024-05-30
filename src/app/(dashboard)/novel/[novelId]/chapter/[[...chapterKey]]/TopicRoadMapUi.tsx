'use client'

import SimpleBar from "simplebar-react";

const TopicRoadMapUi = ({ topicDetails }: { topicDetails: any }) => {
    console.log(topicDetails);
    return (
        <SimpleBar style={{ maxHeight: '74vh' }}>
            <div className={`${topicDetails?.details?.chapter_chunks && 'text-slate-500'}`} >
                {
                    topicDetails?.details?.chapter_topics?.topics.map((item: any, index: number) => (
                        <div key={index}>
                            <div className="bg-[#0C0C0D] my-2 border relative border-input rounded-md p-1">
                                <div className="flex items-center justify-between">
                                    <h1>Topic: </h1>{''}
                                    <h1 className="truncate">{item?.name}</h1>
                                </div>
                            </div>
                            {
                                item.topic_points.map((point: any, pointIndex: number) => (
                                    <div key={pointIndex} className="flex mb-2 justify-end items-center">
                                        <div className="bg-[#0C0C0D] w-[70%] point border relative topics-point border-input rounded-md p-2">
                                            <div className="text-center">
                                                <h1 className="font-medium ">Topics point</h1>
                                                <p className="my-1 truncate"> {point.point_content}</p>
                                            </div>

                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </SimpleBar>
    );
};

export default TopicRoadMapUi;

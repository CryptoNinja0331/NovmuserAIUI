'use client';
import { useAppSelector } from "@/lib/hooks";
import SimpleBar from "simplebar-react";

interface TopicDetails {
    details: {
        chapter_chunks: any[];
        chapter_topics: {
            topics: {
                id: string;
                name: string;
                abstract: string;
                topic_points: {
                    id: string;
                    point_content: string;
                }[];
            }[];
        };
    };
    id: string;
    metadata: {
        author_id: string;
        created_at: string;
        novel_id: string;
        updated_at: string;
    };
}

interface TopicRoadMapUiProps {
    topicDetails: TopicDetails;
}

const TopicRoadMapUi = ({ topicDetails }: TopicRoadMapUiProps) => {
    const isHumanFirstChunk = useAppSelector(state => state.chunkData.humanFirstChunk);
    console.log(topicDetails, 'details');
    const getTopicPointColor = (topicId: string, pointId: string) => {
        const activatedPoint = topicDetails?.details?.chapter_chunks.find(
            (data: any) =>
                data?.metadata?.topic_mapping?.topic_id === topicId &&
                data?.metadata?.topic_mapping?.topic_point_id === pointId
        );
        return activatedPoint ? 'bg-purple-500 text-white' : '';
    };

    const getTopicColor = (topicId: string, topicPoints: any[]) => {
        const isAnyTopicPointActivated = topicPoints.some(
            (point) =>
                topicDetails?.details?.chapter_chunks.find(
                    (data: any) =>
                        data?.metadata?.topic_mapping?.topic_id === topicId &&
                        data?.metadata?.topic_mapping?.topic_point_id === point.id
                ) !== undefined
        );
        return isAnyTopicPointActivated ? 'bg-purple-500 text-white' : '';
    };

    return (
        <SimpleBar style={{ maxHeight: '74vh' }}>
            <div className={topicDetails?.details?.chapter_chunks ? 'text-slate-500' : ''}>
                {topicDetails?.details?.chapter_topics?.topics.map((item, index) => (
                    <div key={item.id}>
                        <div
                            className={`${getTopicColor(item.id, item.topic_points)} ${isHumanFirstChunk && index === 0 ? 'bg-purple-500 text-white' : ''} bg-[#0C0C0D] my-2 border relative border-input rounded-md p-1`}
                        >
                            <div className="flex items-center justify-between">
                                <h1>Topic: </h1>
                                <h1 className="truncate">{item.name}</h1>
                            </div>
                        </div>
                        {item.topic_points.map((point, pointIndex) => (
                            <div key={point.id} className="flex mb-2 justify-end items-center">
                                <div
                                    className={`${getTopicPointColor(item.id, point.id)} ${isHumanFirstChunk && index === 0 && pointIndex === 0 ? 'bg-purple-500 text-white' : ''} bg-[#0C0C0D] w-[70%] point border relative topics-point border-input rounded-md p-2`}
                                >
                                    <div className="text-center">
                                        <h1 className="font-medium ">Topics point</h1>
                                        <p className="my-1 truncate"> {point.point_content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </SimpleBar>
    );
};

export default TopicRoadMapUi;

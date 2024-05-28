
import { IoArrowBackCircleOutline } from 'react-icons/io5';

import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { getChapterInfo } from '@/lib/apiCall/server/getChapterInfo';

import ChapterUi from './ChapterUi';
import TopicRoadMapUi from './TopicRoadMapUi';





const ChapterDetails = async ({ params }: { params: any }) => {
    let chapterKey = params.chapterKey;
    let novelId = params.novelId
    const { getToken } = auth();

    async function initChapter() {
        const token = await getToken({ template: "UserToken" });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/init/${novelId}/${chapterKey}`,
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
            console.log(responseData);

        } else {
            console.error("Failed to initialize chapter");

        }
    }

    initChapter()

    let topicsData = await getChapterInfo(chapterKey)
    console.log(topicsData);

    return (
        <div className="text-white relative flex justify-between  ">

            <div className=" inline-block w-[16rem] h-full p-3">
                <Link className='' href={`/novel/${novelId}`}
                >
                    <button className="flex bg-[#150F2D] mb-3 rounded-md p-1 text-sm items-center gap-1" >
                        <IoArrowBackCircleOutline />
                        Chapter 1
                    </button>
                </Link>
                <h1 className="text-[1.1rem] font-medium">Chapter List</h1>
                <div className="mt-4 bg-[#150F2D] text-center rounded-md p-3">

                    <div>
                        <ChapterUi topicDetails={topicsData.data} novelId={novelId} chapterKey={chapterKey} />
                    </div>

                    <div>
                        <TopicRoadMapUi topicDetails={topicsData.data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterDetails;
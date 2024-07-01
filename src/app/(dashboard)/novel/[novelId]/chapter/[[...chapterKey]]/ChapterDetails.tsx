import { IoArrowBackCircleOutline } from "react-icons/io5";

import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { getChapterInfo } from "@/lib/apiCall/server/getChapterInfo";

import ChapterUi from "./ChapterUi";
import TopicRoadMapUi from "./TopicRoadMapUi";

const ChapterDetails = async ({ params }: { params: any }) => {
  let chapterKey = params.chapterKey;

  let novelId = params.novelId;
  console.log(novelId, "novelid");
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

  initChapter();

  const topicsData = await getChapterInfo(chapterKey[0]);

  return (
    <div className="text-white relative h-full flex justify-between">
      <div className=" inline-block w-[16rem] h-full p-3">
        <Link className="" href={`/novel/${novelId}`}>
          <button className="flex bg-[#150F2D] mb-3 rounded-md p-1 text-sm items-center gap-1">
            <IoArrowBackCircleOutline />
            <h1 className="">Chapter List</h1>
          </button>
        </Link>
        <div className="mt-4 bg-[#150F2D]  rounded-md p-3">
          <div className="text-sm">
            {decodeURIComponent(chapterKey[1])} :{" "}
            {decodeURIComponent(chapterKey[2])}
          </div>
          <div>
            <ChapterUi
              topicDetails={topicsData.data}
              novelId={novelId}
              chapterKey={chapterKey}
            />
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

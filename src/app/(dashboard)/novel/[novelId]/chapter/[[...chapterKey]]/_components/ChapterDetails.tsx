import { IoArrowBackCircleOutline } from "react-icons/io5";

import Link from "next/link";

import { getOrInitChapterInfo } from "@/lib/apiCall/server/getOrInitChapterInfo";
import ChapterUi from "./ChapterUi";
import TopicRoadMapUi from "./TopicRoadMapUi";

export type TChapterDetailsProps = {
  novelId: string;
  chapterKey: string;
  chapterNumber: string;
  chapterTitle: string;
};

const ChapterDetails = async ({
  novelId,
  chapterKey,
  chapterNumber,
  chapterTitle,
}: TChapterDetailsProps) => {
  console.log("🚀 ~ novelId:", novelId);
  console.log("🚀 ~ ChapterDetails ~ chapterKey:", chapterKey);

  const chapterInfo = await getOrInitChapterInfo({
    novelId,
    chapterKey: chapterKey[0],
  });

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
            {decodeURIComponent(chapterNumber)} :{" "}
            {decodeURIComponent(chapterTitle)}
          </div>
          <div>
            <ChapterUi
              chapterInfo={chapterInfo.data!}
              novelId={novelId}
              chapterKey={chapterKey}
            />
          </div>

          <div>
            <TopicRoadMapUi chapterInfo={chapterInfo.data!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetails;

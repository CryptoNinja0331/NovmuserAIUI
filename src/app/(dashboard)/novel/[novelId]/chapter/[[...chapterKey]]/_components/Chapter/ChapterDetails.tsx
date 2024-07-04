'use client'
import { IoArrowBackCircleOutline } from "react-icons/io5";

import Link from "next/link";

import ChapterUi from "./ChapterUi";
import TopicRoadMapUi from "../ChapterTopic/TopicRoadMapUi";
import React, { useEffect } from 'react';
import { TChapterInfo } from '@/lib/types/api/chapter';
import { ChapterContext } from '../../context/useChapterContext'
export type TChapterDetailsProps = {
  novelId: string;
  chapterNumber: string;
  chapterTitle: string;
  chapterInfo: TChapterInfo;
};

const ChapterDetails = ({
  novelId,
  chapterKey,
  chapterNumber,
  chapterTitle,
  chapterInfo
}: TChapterDetailsProps) => {
  // console.log("🚀 ~ novelId:", novelId);
  // console.log("🚀 ~ ChapterDetails ~ chapterKey:", chapterKey);
  // console.log("🚀 ~ ChapterDetails ~ chapterInfo:", chapterInfo);
  const { updateCurrentId } = React.useContext(ChapterContext)

  useEffect(() => {
    if (chapterInfo) {
      updateCurrentId(chapterInfo?.metadata?.topic_mapping?.topic_id, chapterInfo?.metadata?.topic_mapping?.topic_point_id)
    }
  }, [chapterInfo])
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
              chapterInfo={chapterInfo}
              novelId={novelId}
            />
          </div>

          <div>
            <TopicRoadMapUi
              chapterInfo={chapterInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetails;

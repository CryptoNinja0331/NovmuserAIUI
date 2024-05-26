'use client';
import Link from "next/link";
import { Chapter } from "./page";

interface SingleChapterProps {
    item: Chapter;
    novelId: string;
}

const SingleChapter = ({ item, novelId }: SingleChapterProps) => {
    const chapterTitle = encodeURIComponent(item.title);
    const chapterNumber = item.chapter_number;

    return (
        <div className="bg-[#150F2D] tracking-wide rounded-md p-3 cursor-pointer">
            <Link
                href={`/novel/${novelId}/chapter/${item.chapter_key}`}

            >
                {item?.chapter_number} {""} <span> : {item?.title}</span>
            </Link>
        </div>
    );
};

export default SingleChapter;
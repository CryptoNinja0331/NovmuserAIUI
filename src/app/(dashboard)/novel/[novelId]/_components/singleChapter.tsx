import { TChapter } from "@/lib/types/api/agent";
import Link from "next/link";

interface SingleChapterProps {
  item: TChapter;
  novelId: string;
}

const SingleChapter = ({ item, novelId }: SingleChapterProps) => {
  console.log(item?.chapter_number);

  return (
    <Link
      href={`/novel/${novelId}/chapter/${item.chapter_key}/${item.chapter_number}/${item?.title}`}
      className="inline-block"
    >
      <div className="bg-[#150F2D] tracking-wide rounded-md p-3 cursor-pointer">
        {item?.chapter_number} {""} <span> : {item?.title}</span>
      </div>
    </Link>
  );
};

export default SingleChapter;

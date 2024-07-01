import { Chapter } from "../page";
import SingleChapter from "./singleChapter";

interface ChapterDetailsWrapperProps {
  chapters: Chapter[];
  novelId: string;
}

const ChapterDetailsWrapper = ({
  chapters,
  novelId,
}: ChapterDetailsWrapperProps) => {
  return (
    <div className="relative mt-2 h-full">
      <div className="space-y-2 mt-2 text-sm font-medium">
        <h1 className="text-[1.1rem] font-medium mb-2">Chapter List</h1>
        <div className="space-y-3">
          {chapters.map((item: Chapter) => (
            <SingleChapter
              novelId={novelId}
              key={item.chapter_number}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterDetailsWrapper;

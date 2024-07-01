import NovelSidebar from "@/components/singleNovel/NovelSidebar";
import ChapterDetails from "./ChapterDetails";
import { getSingleNovel } from "@/lib/apiCall/server/getSingleNovel";
import Terminal from "../../../../_component/Terminal";
import { getChapterInfo } from "@/lib/apiCall/server/getChapterInfo";
import NovelEditingArea from "@/app/(dashboard)/_component/ChapterEditingArea";
const page = async ({
  params,
}: {
  params: { chapterKey: string; novelId: string };
}) => {
  const response = await getSingleNovel(params.novelId);
  const chapterKey = params.chapterKey[0];

  const chapterInfo = await getChapterInfo(chapterKey);

  return (
    <div className="h-[calc(100%-50px)] relative">
      <div className="text-white relative h-full flex justify-between ">
        <div className="inline-block w-[16rem] h-full border-r border-input p-3">
          <ChapterDetails params={params} />
        </div>

        <NovelEditingArea chapterInfo={chapterInfo.data!} />

        {/* <Terminal chapterInfo={chapterInfo.data!} chapterKey={chapterKey} /> */}

        <div className="relative mt-2">
          <NovelSidebar novelDetails={response.data} />
        </div>
      </div>
    </div>
  );
};

export default page;

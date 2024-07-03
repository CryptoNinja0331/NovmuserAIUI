import NovelSidebar from "@/components/singleNovel/NovelSidebar";
import { getOrInitChapterInfo } from "@/lib/apiCall/server/getOrInitChapterInfo";
import { getSingleNovel } from "@/lib/apiCall/server/getSingleNovel";
import ChapterDetails from "./_components/Chapter/ChapterDetails";
import NovelEditingArea from "./_components/Chapter/ChapterEditingArea";
const page = async ({
  params,
}: {
  params: { chapterKey: string[]; novelId: string };
}) => {
  console.log("🚀 ~ chapterKey:", params.chapterKey);
  const response = await getSingleNovel(params.novelId);
  const chapterKeySegments: string[] = params.chapterKey;
  const chapterKey = chapterKeySegments[0];

  const chapterInfo = await getOrInitChapterInfo({
    novelId: params.novelId,
    chapterKey,
  });

  return (
    <div className="h-[calc(100%-50px)] relative">
      <div className="text-white relative h-full flex justify-between ">
        <div className="inline-block w-[16rem] h-full border-r border-input p-3">
          <ChapterDetails
            {...{
              novelId: params.novelId,
              chapterKey,
              chapterNumber: chapterKeySegments[1],
              chapterTitle: chapterKeySegments[2],
            }}
          />
        </div>

        <NovelEditingArea
          novelId={params.novelId}
          chapterInfo={chapterInfo.data!}
        />

        <div className="relative mt-2">
          <NovelSidebar novelDetails={response.data} />
        </div>
      </div>
    </div>
  );
};

export default page;

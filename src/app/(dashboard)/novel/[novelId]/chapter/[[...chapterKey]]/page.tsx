import NovelSidebar from "@/components/singleNovel/NovelSidebar";
import { getOrInitChapterInfo } from "@/lib/apiCall/server/getOrInitChapterInfo";
import { getSingleNovel } from "@/lib/apiCall/server/getSingleNovel";
import { revalidatePath, revalidateTag } from "next/cache";
import ChapterWrapper from "./_components/chapterWrapper";
const page = async ({
  params,
}: {
  params: { chapterKey: string[]; novelId: string };
}) => {
  console.log("🚀 ~ chapterKey:", params.chapterKey);
  const response = await getSingleNovel(params.novelId);
  const chapterKeySegments: string[] = params.chapterKey;
  const chapterKey = chapterKeySegments[0];

  const chapterInfo = (
    await getOrInitChapterInfo({
      novelId: params.novelId,
      chapterKey,
    })
  ).data!;

  return (
    <div className="h-[calc(100%-50px)] relative">
      <div className="text-white relative h-full flex justify-between">
        <ChapterWrapper
          chapterInfo={chapterInfo}
          chapterKey={params.chapterKey}
          novelId={params.novelId}
        />
        <div className="relative mt-2">
          <NovelSidebar novelDetails={response.data} />
        </div>
      </div>
    </div>
  );
};

export default page;

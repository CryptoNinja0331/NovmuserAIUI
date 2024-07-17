import NovelSidebar from "@/components/singleNovel/NovelSidebar";
import { getOrInitChapterInfo } from "@/lib/apiCall/server/getOrInitChapterInfo";
import { getSingleNovel } from "@/lib/apiCall/server/getSingleNovel";
import ChapterWrapper from './_components/chapterWrapper';
import { TResponseDto } from '@/lib/http';
import { TNovel } from '@/lib/types/api/novel';
const page = async ({
  params,
}: {
  params: { chapterKey: string[]; novelId: string };
}) => {
  console.log("🚀 ~ chapterKey:", params.chapterKey);
  const response: TResponseDto<TNovel> = await getSingleNovel(params.novelId);
  const chapterKeySegments: string[] = params.chapterKey;
  const chapterKey = chapterKeySegments[0];

  const chapterInfo = (
    await getOrInitChapterInfo({
      novelId: params.novelId,
      chapterKey,
    })
  ).data!;
  return (
    <div className="h-[calc(100%-50px)] text-white w-full overflow-x-hidden flex relative justify-between">
      <ChapterWrapper
        chapterInfo={chapterInfo}
        chapterKey={params.chapterKey}
        novelId={params.novelId}
      />
      <div className="mt-2">
        <NovelSidebar novelDetails={response.data} />
      </div>
    </div>
  );
};

export default page;

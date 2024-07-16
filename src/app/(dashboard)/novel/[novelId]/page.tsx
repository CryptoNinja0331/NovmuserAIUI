import NovelName from "@/components/NovelName";
import NovelSidebar from "@/components/singleNovel/NovelSidebar";
import { getSingleNovel } from "@/lib/apiCall/server/getSingleNovel";
import ChapterDetailsWrapper from "./_components/ChapterDetailsWrapper";

interface PageProps {
  params: {
    novelId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const response = await getSingleNovel(params.novelId);

  return (
    <div className="h-[calc(100%-50px)]">
      <NovelName novelData={response?.data} />
      <div className="text-white relative flex justify-between h-[calc(100F%-40px)]">
        <div className="inline-block w-[16rem] h-full border-r border-input p-3">
          <ChapterDetailsWrapper
            novelId={params.novelId}
            chapters={response?.data?.details?.chapter_outline?.chapters || []}
          />
        </div>
        <div className="relative mt-2">
          <NovelSidebar novelDetails={response.data} />
        </div>
      </div>
    </div>
  );
}

"use server";
import { getAllNovels } from "@/lib/apiCall/server/getAllNovel";

import NovelPage from "./_components/NovelPage";

const page = async ({ searchParams }: { searchParams: any }) => {
  const currentPage = Number(searchParams.page ? searchParams.page : 1);
  const response = await getAllNovels(currentPage);

  return (
    <NovelPage novelPageRespDto={response?.data} currentPage={currentPage} />
  );
};

export default page;

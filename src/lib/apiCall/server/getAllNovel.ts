"use server";

import { GET, TResponseDto } from "@/lib/http";
import { getToken } from "./getToken";
import { TNovel } from "@/lib/types/api/novel";
import { TPaginationResponseDto } from "@/lib/types/api/page";
import { revalidateTag } from "next/cache";

const NOVEL_PAGE_CACHE_TAG = "novelPage";

export async function getAllNovels(pageNumber: number) {
  return await GET<TResponseDto<TPaginationResponseDto<TNovel>>>({
    url: "/novel/page",
    params: {
      page_number: `${pageNumber}`,
      page_size: "7",
    },
    token: await getToken(),
    config: {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: [NOVEL_PAGE_CACHE_TAG],
      },
    },
    next: { tags: ["allNovels"] },
  });
}

export const refreshNovelPage = async () => {
  revalidateTag(NOVEL_PAGE_CACHE_TAG);
};

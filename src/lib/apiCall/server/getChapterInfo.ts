"use server";

import { GET, TResponseDto } from "@/lib/http";
import { TChapterInfo } from "@/lib/types/api/chapter";
import { getToken } from "./getToken";

export async function getChapterInfo(
  chapterKey: string
): Promise<TResponseDto<TChapterInfo>> {
  return await GET<TResponseDto<TChapterInfo>>({
    url: `/chapter/${chapterKey}/chapterInfo`,
    token: await getToken(),
  });
}

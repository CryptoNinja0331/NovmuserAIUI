"use server";

import { POST, TResponseDto } from "@/lib/http";
import { TChapterInfo } from "@/lib/types/api/chapter";
import { getChapterInfo } from "./getChapterInfo";
import { getToken } from "./getToken";
import { revalidateTag } from "next/cache";

const CHAPTER_INFO_CACHE_TAG = "chapterInfo";

export const getOrInitChapterInfo = async ({
  novelId,
  chapterKey,
}: {
  novelId: string;
  chapterKey: string;
}): Promise<TResponseDto<TChapterInfo>> => {
  try {
    return await getChapterInfo(chapterKey);
  } catch (e) {
    if (e instanceof Error && e.cause === 404) {
      console.log(`🚀 Ready to init chapterInfo, chapterKey=${chapterKey}`);
      return await POST<TResponseDto<TChapterInfo>>({
        url: `/chapter/init/${novelId}/${chapterKey}`,
        token: await getToken(),
        config: {
          next: {
            tags: [CHAPTER_INFO_CACHE_TAG],
          },
        },
      });
    } else {
      console.error("🚀 getOrInitChapterInfo ~ error:", e);
      throw e;
    }
  }
};

export const refreshChapterInfo = async () => {
  revalidateTag(CHAPTER_INFO_CACHE_TAG);
};

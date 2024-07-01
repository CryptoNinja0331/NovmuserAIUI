"use server";

import { GET, TResponseDto } from "@/lib/http";
import { TChapterInfo } from "@/lib/types/api/chapter";
import { getToken } from "./getToken";

// export async function getChapterInfo(chapterKey: string) {
//   const { getToken } = auth();
//   const userId = await getToken({ template: "UserToken" });

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/${chapterKey}/chapterInfo`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userId}`,
//       },
//       next: { tags: ["chapterInfo"] },
//     }
//   );
//   if (!res.ok) {
//     // throw new Error("Failed to fetch data");
//   }
//   return res.json();
// }

export const getChapterInfo = async (
  chapterKey: string
): Promise<TResponseDto<TChapterInfo>> => {
  return await GET<TResponseDto<TChapterInfo>>({
    url: `/chapter/${chapterKey}/chapterInfo`,
    token: await getToken(),
  });
};

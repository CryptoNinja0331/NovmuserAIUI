"use server";

import { GET, TResponseDto } from "@/lib/http";
import { getToken } from "./getToken";

export async function getAllNovels(pageNumber: any) {
  // TODO 2024-06-18 Define type of novel page
  return await GET<TResponseDto<any>>({
    url: "/novel/page",
    params: {
      page_number: pageNumber,
      page_size: "7",
    },
    token: await getToken(),
    config: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    next: { tags: ["allNovels"] },
  });
}

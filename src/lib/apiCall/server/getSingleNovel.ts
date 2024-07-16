"use server";
import { GET, TResponseDto } from "@/lib/http";
import { getToken } from "./getToken";
import { TNovel } from "@/lib/types/api/novel";

export async function getSingleNovel(id: string) {
  return await GET<TResponseDto<TNovel>>({
    url: `/novel/${id}`,
    token: await getToken(),
    config: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });
}

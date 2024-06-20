"use server";
import { GET, TResponseDto } from "@/lib/http";
import { getToken } from "./getToken";

export async function getSingleNovel(id: string) {
  return await GET<TResponseDto<any>>({
    url: `/novel/${id}`,
    token: await getToken(),
    config: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });
}

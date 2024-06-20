"use server";

import { GET, TResponseDto } from "@/lib/http";
import { TUserInfoDto } from "@/lib/types/api/user";
import { getToken } from "./getToken";

export const getUserInfo = async (): Promise<TResponseDto<TUserInfoDto>> => {
  return await GET<TResponseDto<TUserInfoDto>>({
    url: "/user/info",
    token: (await getToken())!,
  });
};

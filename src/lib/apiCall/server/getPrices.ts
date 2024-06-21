"use server";

import { GET, TResponseDto } from "@/lib/http";
import { TPriceInfo } from "@/lib/types/api/payment";

export const getPrices = async (): Promise<TResponseDto<TPriceInfo[]>> => {
  return await GET<TResponseDto<TPriceInfo[]>>({
    url: "/payment/get_prices",
  });
};

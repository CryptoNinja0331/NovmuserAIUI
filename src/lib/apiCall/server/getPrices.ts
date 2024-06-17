"use server";

import { GET, TResponseDto } from "@/lib/http";

export type TSubscriptionPlan = {
  price_name: string;
  price_description: string;
  amount: string;
  currency: string;
  stripe_price_id: string;
  type: string;
  interval: string;
  id: string;
  services: string[];
  in_active: boolean;
};

export const getPrices = async (): Promise<
  TResponseDto<TSubscriptionPlan[]>
> => {
  return await GET<TResponseDto<TSubscriptionPlan[]>>({
    url: "/payment/get_prices",
  });
};

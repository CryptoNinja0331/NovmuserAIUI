import { GET, TResponseDto } from "@/lib/http";
import { getToken } from "./getToken";

export type TSubscriptionInfo = {
  id: string;
  order_id: string;
  price_id: string;
  sub_id: string;
  cancel_at_period_end: boolean;
  start_time: string;
  end_time: string;
  status: string;
};

export const getUserSubscriptionList = async (): Promise<
  TResponseDto<TSubscriptionInfo[]>
> => {
  return await GET<TResponseDto<TSubscriptionInfo[]>>({
    url: "/payment/get_user_subscription_list",
    token: (await getToken())!,
  });
};

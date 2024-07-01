import { GET, TResponseDto } from "@/lib/http";
import { getToken } from "./getToken";
import { TSubscriptionInfo } from "@/lib/types/api/subscription";

export const getUserSubscriptionList = async (): Promise<
  TResponseDto<TSubscriptionInfo[]>
> => {
  return await GET<TResponseDto<TSubscriptionInfo[]>>({
    url: "/payment/get_user_subscription_list",
    token: (await getToken())!,
  });
};

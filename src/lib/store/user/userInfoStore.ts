import { getUserInfo } from "@/lib/apiCall/server/getUserInfo";
import { TUserInfoDto } from "@/lib/types/api/user";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type TUserInfo = Omit<TUserInfoDto, "credit_amount"> & {
  creditAmount?: number;
};

export type TUserInfoState = {
  userInfo?: TUserInfo;
  loading?: boolean;
};

export type TUserInfoAction = {
  fetchUserInfo: () => Promise<void>;
  incrementCredit: (amount: number) => void;
  decrementCredit: (amount: number) => void;
};

const useUserInfoStore = create(
  subscribeWithSelector<TUserInfoState & TUserInfoAction>((set, get) => ({
    // States
    userInfo: undefined,
    loading: false,
    // Actions
    fetchUserInfo: async () => {
      console.log(
        "🚀 ~ fetchUserInfo: ~ fetchUserInfo",
        "fetch and set userInfo"
      );
      set({ loading: true });
      const respDto = await getUserInfo();
      console.log("🚀 ~ fetchUserInfo: ~ respDto:", respDto);
      const userInfoDto = respDto?.data;
      if (userInfoDto) {
        const creditAmountStr = userInfoDto.credit_amount ?? "0";
        set({
          userInfo: {
            ...userInfoDto,
            creditAmount: Number(creditAmountStr),
          },
        });
        set({ loading: false });
      }
    },
    incrementCredit: (amount: number) => {
      const existedUserInfo = get().userInfo;
      if (!existedUserInfo) {
        return;
      }
      console.log("Ready to increment credit");
      set(() => ({
        userInfo: {
          ...existedUserInfo,
          creditAmount: (existedUserInfo.creditAmount ?? 0) + amount,
        },
      }));
    },
    decrementCredit: (amount: number) => {
      const existedUserInfo = get().userInfo;
      if (!existedUserInfo) {
        return;
      }
      console.log("Ready to decreemnt credit");
      set(() => ({
        userInfo: {
          ...existedUserInfo,
          creditAmount: (existedUserInfo.creditAmount ?? 0) - amount,
        },
      }));
    },
  }))
);

export default useUserInfoStore;

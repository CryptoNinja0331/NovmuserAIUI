"use client";

import useUserInfoStore from "@/lib/store/user/userInfoStore";
import { cn } from "@/lib/utils";
import { todo } from "node:test";
import React, { FC } from "react";
import { HiCurrencyDollar } from "react-icons/hi";
import { shallow } from "zustand/shallow";

export type TUserCreditsProps = {
  showIcon?: boolean | undefined;
  className?: string | undefined;
};

const UserCredits: FC<TUserCreditsProps> = ({ showIcon = true, className }) => {
  const [creditAmount, setCreditAmount] = React.useState<number>(0);
  const loading = useUserInfoStore((state) => state.loading);

  React.useEffect(() => {
    const unSub = useUserInfoStore.subscribe(
      (state) => state.userInfo,
      (cur, prev) => {
        if (!cur) {
          return;
        }
        if (
          cur.creditAmount !== prev?.creditAmount ||
          cur.creditAmount !== creditAmount
        ) {
          setCreditAmount(cur.creditAmount ?? 0);
        }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      }
    );
    return () => {
      unSub();
    };
  }, [creditAmount]);

  return (
    <div className={cn("flex flex-row justify-center items-center", className)}>
      {loading ? (
        // TODO 2024-06-20 Add loading component
        <div className="w-6 h-6 rounded-full border-2 border-gray-600 border-t-transparent animate-spin" />
      ) : (
        <>
          {showIcon && <HiCurrencyDollar className="text-xl" />}
          {creditAmount} Credits
        </>
      )}
    </div>
  );
};

export default React.memo(UserCredits);

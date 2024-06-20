"use client";
import { AppStore, makeStore } from "@/lib/store/store";
import useUserInfoStore from "@/lib/store/user/userInfoStore";
import React from "react";
import { useRef } from "react";
import { Provider } from "react-redux";
import { shallow } from "zustand/shallow";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  React.useLayoutEffect(() => {
    const unSub = useUserInfoStore.subscribe(
      (state) => ({
        userInfo: state.userInfo,
        fetchUserInfo: state.fetchUserInfo,
      }),
      async (cur, prev) => {
        if (
          !cur.userInfo ||
          (cur.userInfo.email !== prev.userInfo?.email &&
            cur.userInfo.creditAmount !== prev.userInfo?.creditAmount)
        ) {
          // Fetch user info
          await cur.fetchUserInfo();
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
  }, []);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // storeRef.current.dispatch(incrementByAmount(7))
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

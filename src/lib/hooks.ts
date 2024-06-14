import { useDispatch, useSelector, useStore } from "react-redux";
import { AppDispatch, AppStore, RootState } from "./store/store";
import { useAuth } from "@clerk/nextjs";
import React from "react";
// import type { RootState, AppDispatch, AppStore } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useGetClientToken = (): {
  getClientToken: () => Promise<string | null>;
} => {
  const { getToken } = useAuth();

  const getClientToken = React.useCallback(async () => {
    const token = await getToken({ template: "UserToken" });
    return token;
  }, [getToken]);

  return {
    getClientToken,
  };
};

import { useDispatch, useSelector, useStore } from "react-redux";
import { AppDispatch, AppStore, RootState } from "./store/store";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { getToken } from "./apiCall/server/getToken";
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

export const useToken = () => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    getToken({ template: "UserToken" }).then((userId) => {
      setToken(userId);
    });
  }, [getToken]);
  return { token };
};

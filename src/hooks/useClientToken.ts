import { useAuth } from "@clerk/nextjs";
import React from "react";

const useClientToken = () => {
  const { getToken } = useAuth();

  const getClientToken = React.useCallback(async () => {
    return await getToken({ template: "UserToken" });
  }, [getToken]);

  return { getClientToken };
};

export default useClientToken;

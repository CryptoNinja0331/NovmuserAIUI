"use server";

import { auth } from "@clerk/nextjs";

export const getToken = async (): Promise<string | null> => {
  const { getToken } = auth();
  return await getToken({ template: "UserToken" });
};

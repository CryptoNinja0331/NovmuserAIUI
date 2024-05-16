"use server";

import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";

export const handleDeleteNovel = async (formData: FormData) => {
  const { getToken } = auth();
  const novelId = formData.get("novelId");

  const userId = await getToken({ template: "UserToken" });
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/novel/${novelId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
      }
    );

    if (response.ok) {
      revalidateTag("allNovels");
    }
  } catch (e) {
    console.log(e);
  }
};

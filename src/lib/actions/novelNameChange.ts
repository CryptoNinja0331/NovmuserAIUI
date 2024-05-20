"use server";

import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";

export async function handleNovelNameChange(
  prevState: any,
  formData: FormData
) {
  const editedName = formData.get("novelName");
  const { getToken } = auth();
  const userId = await getToken({ template: "UserToken" });

  const updatedData = {
    ...prevState.data,
    metadata: {
      ...prevState?.data?.metadata,
      name: editedName,
    },
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/novel/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      revalidateTag("singleNovels");

      return { message: "Novel Name Changes", data: responseData };
    } else {
      console.error("Failed Novel Name Changes");
      return { message: "Failed Novel Name Changes" };
    }
  } catch (e) {
    return { message: "Failed Novel Name Changes" };
  }
}

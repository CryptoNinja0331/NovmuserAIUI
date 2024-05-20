"use server";
import { auth } from "@clerk/nextjs";

export async function getSingleNovel(id: string) {
  const { getToken } = auth();
  const userId = await getToken({ template: "UserToken" });

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/novel/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userId}`,
    },
    next: { tags: ["singleNovels"] },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

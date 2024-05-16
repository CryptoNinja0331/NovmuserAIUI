"use server";

import { auth } from "@clerk/nextjs";

export async function getAllNovels(pageNumber: any) {
  const { getToken } = auth();
  const userId = await getToken({ template: "UserToken" });

  let params = new URLSearchParams();

  params.append("page_number", pageNumber);
  params.append("page_size", "7");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/novel/page?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`,
      },
      next: { tags: ["allNovels"] },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

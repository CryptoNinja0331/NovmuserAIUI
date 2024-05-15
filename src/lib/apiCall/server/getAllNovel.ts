"use server";
import { auth } from "@clerk/nextjs";

export async function getAllnovels() {
  const { getToken } = auth();
  const userId = await getToken({ template: "UserToken" });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/novel/page?page_number=1&page_size=10`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

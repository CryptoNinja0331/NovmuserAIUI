"use server";

import { auth } from "@clerk/nextjs";

export async function getPrices() {
  const { getToken } = auth();
  const userId = await getToken({ template: "UserToken" });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/payment/get_prices`,
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

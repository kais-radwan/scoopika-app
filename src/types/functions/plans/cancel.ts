"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function cancelSub(id: string | number) {
  if (!id) {
    return { success: false };
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    return { success: false };
  }

  try {
    const res = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
        }
      }
    );

    const data = await res.json();

    if (data.errors && data.errors?.length > 0 || data.erro) {
      throw new Error("cancel error");
    }

    return { success: true };
  } catch {
    return { success: false };
  }
}

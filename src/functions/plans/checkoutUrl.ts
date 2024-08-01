"use server";

import { authOptions } from "@/lib/auth";
import { createCheckout, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { getServerSession } from "next-auth";

export default async function getCheckoutUrl(
  type: "basic" | "scale",
  embed: boolean = false
) {
  console.log("checkout type:", type);

  const session = await getServerSession(authOptions);
  const variant = type === "basic" ? "408935" : "408932";

  if (!session) {
    return { success: false };
  }

  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      throw new Error(`Lemon Squeezy API error: ${error.message}`);
    },
  });

  try {
    const checkout = await createCheckout("63009", variant, {
      checkoutOptions: {
        embed,
        media: false,
        logo: !embed,
      },
      checkoutData: {
        email: session.user.email ?? undefined,
        custom: {
          user_id: session.user.id,
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
        receiptButtonText: "Go to app",
        receiptThankYouNote: "Thank you for upgrading your Scoopika plan!",
      },
    });

    console.log(checkout);

    return {
      success: true,
      url: checkout.data?.data.attributes.url,
    };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}

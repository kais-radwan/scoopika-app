"use server";

import { authOptions } from "@/lib/auth";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { getServerSession } from "next-auth";

export default async function getCheckoutUrl(
  type: "basic" | "scale",
  embed: boolean = false,
) {
  console.log('checkout type:', type);

  const session = await getServerSession(authOptions);
  const variant =
    type === "basic" ? "408935" : "408932";

  console.log("variant:", variant);

  if (!session) {
    return { success: false };
  }

  const checkout = await createCheckout(
    "63009",
    variant,
    {
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
    },
  );

  return {
    success: true,
    url: checkout.data?.data.attributes.url,
  };
}

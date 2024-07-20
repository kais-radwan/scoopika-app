"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { readPlan } from "@/scripts/plan";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function createKnowledgeStore(name: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { success: false };
  }

  const plan = await await readPlan(session.user.plan);

  if (plan.type === "free" || plan.status !== "active") {
    return { success: false };
  }

  const id = crypto.randomUUID();

  await db.knowledgeStore.create({
    data: {
      userId: session.user.id,
      name,
      id
    },
  });

  await revalidatePath("/knowledge");

  return redirect(`/knowledge/${id}`);
  return { success: true };
}

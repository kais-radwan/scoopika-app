"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import generateSecret from "@/scripts/secret";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export default async function deleteKnowledgeSource(
  storeId: string,
  knowledgeId: string,
  vectors: string[],
) {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false };

  const secret = generateSecret();

  const res = await fetch(`${process.env.SOURCE}/private/knowledge/${storeId}`, {
    method: "DELETE",
    headers: { authorization: secret },
    body: JSON.stringify({ vectors }),
  });

  const data = await res.json();
  if (!data.success) return { success: false };

  await db.knowledgeSource.delete({
    where: {
      id: knowledgeId,
      storeId
    },
  });

  await revalidatePath(`/knowledge/${storeId}`);
  return { success: true };
}

"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import generateSecret from "@/scripts/secret";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function deleteKnowledge(
  id: string,
  knowledgeId: string,
  vectors: string[],
) {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false };

  const secret = generateSecret();

  const res = await fetch(`${process.env.SOURCE}/private/knowledge/${id}`, {
    method: "DELETE",
    headers: { authorization: secret },
    body: JSON.stringify({ vectors }),
  });

  const data = await res.json();
  if (!data.success) return { success: false };

  await db.knowledge.delete({
    where: {
      id: knowledgeId,
    },
  });

  await revalidatePath(`/app/agents/${id}`);
  return { success: true };
}

export async function deleteKnowledgeStore(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { success: false };
  }

  const secret = generateSecret();

  await fetch(`${process.env.SOURCE}/private/delete-knowledge/${id}`, {
    method: "DELETE",
    headers: { authorization: secret },
  });

  await db.knowledgeSource.deleteMany({
    where: {
      userId: session.user.id,
      storeId: id
    }
  })

  await db.knowledgeStore.delete({
    where: {
      id,
      userId: session.user.id
    }
  })

  return redirect("/knowledge");
}
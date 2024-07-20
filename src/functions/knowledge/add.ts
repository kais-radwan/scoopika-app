"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { readPlan } from "@/scripts/plan";
import generateSecret from "@/scripts/secret";
import isValidURL from "@/scripts/valid_url";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import pdf from "pdf-parse";

export async function addFileKnowledge(
  storeId: string,
  name: string,
  content: string
): Promise<
  | {
      success: false;
      error?: string;
    }
  | { success: true }
> {
  const session = await getServerSession(authOptions);

  if (!session) return { success: false };

  const plan = session.user.plan;
  const planData = readPlan(plan);

  if (planData.type === "free" || planData.status !== "active") {
    return {
      success: false,
      error: "Invalid access to add knowledge. an active paid plan is required",
    };
  }

  const base64Data = content.split(",")[1];
  const buffer = Buffer.from(base64Data, "base64");

  let text: string = "";

  const mimeType = content.split(";")[0].split(":")[1];

  if (mimeType !== "application/pdf" && !mimeType.startsWith("text")) {
    return {
      success: false,
      error: "File type is not supported",
    };
  }

  if (mimeType === "application/pdf") {
    const pdfData = await pdf(buffer);
    text = pdfData.text;
  } else {
    text = buffer.toString("utf8");
  }

  const secret = generateSecret();
  const fileId = "knowledge_file_" + crypto.randomUUID();
  const res = await fetch(
    `${process.env.SOURCE}/private/knowledge/${storeId}`,
    {
      method: "POST",
      headers: {
        authorization: secret,
      },
      body: JSON.stringify({
        file_id: fileId,
        text,
      }),
    }
  );

  const data = await res.json();

  if (!data.success || !Array.isArray(data.ids)) {
    return data;
  }

  await db.knowledgeSource.create({
    data: {
      storeId,
      fileId,
      name,
      userId: session.user.id,
      vectors: JSON.stringify(data.ids),
      type: "file"
    },
  });

  await revalidatePath(`/knowledge/${storeId}`);
  return { success: true };
}

export async function addWebsiteKnowledge(
  storeId: string,
  url: string
): Promise<{ success: false; error?: string } | { success: true }> {
  if (!isValidURL(url)) {
    return { success: false };
  }

  const session = await getServerSession(authOptions);

  if (!session) return { success: false };

  const plan = session.user.plan;
  const planData = readPlan(plan);

  if (planData.type === "free" || planData.status !== "active") {
    return {
      success: false,
      error: "Invalid access to add knowledge. an active paid plan is required",
    };
  }

  const websiteRes = await fetch(`https://r.jina.ai/${url}`);
  const text = await websiteRes.text();
  const fileId = `website_${crypto.randomUUID()}`;
  const secret = generateSecret();

  const res = await fetch(
    `${process.env.SOURCE}/private/knowledge/${storeId}`,
    {
      method: "POST",
      headers: {
        authorization: secret,
      },
      body: JSON.stringify({
        file_id: fileId,
        text,
        type: "website",
        url
      }),
    }
  );

  const data = await res.json();

  await db.knowledgeSource.create({
    data: {
      storeId,
      fileId,
      name: url,
      userId: session.user.id,
      vectors: JSON.stringify(data.ids),
      type: "website"
    },
  });

  await revalidatePath(`/knowledge/${storeId}`);
  return { success: true };
}

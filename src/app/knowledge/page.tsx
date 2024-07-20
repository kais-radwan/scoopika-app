import KnowledgeMain from "@/components/main/knowledge/main";
import UpgradePlan from "@/components/main/upgrade";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { readPlan } from "@/scripts/plan";
import { Metadata } from "next";
import { getServerSession, Session } from "next-auth";

export const metadata: Metadata = {
  title: "Knowledge stores",
  description: "Create serverless knowledge stores to expand the knowledge of your AI agents"
}

export default async function Knowledge() {
  const session = (await getServerSession(authOptions)) as Session;
  const plan = readPlan(session.user.plan);

  if (plan.type === "free") {
    return (
      <UpgradePlan description="Add files and websites to a knowledge store so your AI box/agents know more about you, your application, or any custom data you want" />
    );
  }

  const stores = await db.knowledgeStore.findMany({
    where: {
        userId: session.user.id
    }
  })

  return (
    <KnowledgeMain stores={stores} />
  )

}

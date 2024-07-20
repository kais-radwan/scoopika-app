import KnowledgePage from "@/components/main/knowledge/page/main";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { readPlan } from "@/scripts/plan";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const session = (await getServerSession(authOptions)) as Session;
  const store = await db.knowledgeStore.findFirst({
    where: {
      userId: session.user.id,
      id: params.id,
    },
  });

  if (!store) {
    return redirect("/knowledge");
  }

  const sources = await db.knowledgeSource.findMany({
    where: {
      userId: session.user.id,
      storeId: store.id,
    },
  });

  return (
    <KnowledgePage store={store} plan={session.user.plan} sources={sources} />
  );
}

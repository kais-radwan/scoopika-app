import AppHead from "@/components/main/head";
import ProviderItem from "@/components/main/providers/item";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { providersWithImg } from "@/scripts/agents/engines";
import { Metadata } from "next";
import { getServerSession, Session } from "next-auth";

export const metadata: Metadata = {
  title: "LLM Providers",
  description: "Connect LLM Providers to Scoopika AI agents"
}

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session;
  const keys = await db.apikeys.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const keysNames = keys.map((k) => k.name);

  return (
    <>
      <AppHead
        title="LLMs Providers"
        description="Connect the LLMs providers you want to use with your AI agents"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 flex gap-4">
        {providersWithImg.map((provider, index) => (
          <ProviderItem
            key={`provider-${index}-${provider.name}`}
            provider={provider}
            keys={keys}
          />
        ))}
      </div>
    </>
  );
}

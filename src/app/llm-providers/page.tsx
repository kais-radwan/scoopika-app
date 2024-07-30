import CheckItem from "@/components/checkItem";
import AppHead from "@/components/main/head";
import ProviderItem from "@/components/main/providers/item";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { providersWithImg } from "@/scripts/agents/engines";
import { Button } from "@nextui-org/react";
import { IconBook, IconHelp } from "@tabler/icons-react";
import { Metadata } from "next";
import { getServerSession, Session } from "next-auth";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LLM Providers",
  description: "Connect LLM Providers to Scoopika AI agents",
};

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
        title="LLM Providers"
        description="Link your preferred LLM providers to use with your AI agents in your app"
        action={
          <Button
            size="sm"
            color="primary"
            className="font-semibold"
            startContent={<IconBook size={20} />}
            as={Link}
            href="https://docs.scoopika.com/providers"
            target="_blank"
          >
            Documentation
          </Button>
        }
      />

      <div className=" p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 flex gap-4">
        {providersWithImg.map((provider, index) => (
          <ProviderItem
            key={`provider-${index}-${provider.name}`}
            provider={provider}
            keys={[]}
          />
        ))}
      </div>

      {/* <div className="p-10 gap-10 border-t-1 w-full bg-accent/20">
        <div className="flex items-center w-full mb-8 border-b-1 pb-6">
          <div className="flex flex-col gap-2 items-center">
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-foreground text-background relative font-semibold">
              1
            </div>
            <div className="text-xs text-center min-w-max">
              Connect provider
            </div>
          </div>
          <div className="w-full"></div>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-foreground text-background relative font-semibold">
              2
            </div>
            <div className="text-xs text-center min-w-max">Copy the code</div>
          </div>
          <div className="w-full"></div>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-foreground text-background relative font-semibold">
              3
            </div>
            <div className="text-xs text-center min-w-max">Use in your app</div>
          </div>
        </div>
        <div className="mb-3 font-semibold flex items-center gap-2">
          <IconHelp />
          What is this?
        </div>
        <p className="text-sm opacity-90">
          Companies such as OpenAI and Groq (providers) offer access to a range
          of large language models (LLMs) through their APIs. These LLMs have
          varying strengths and capabilities.
        </p>
        <div className="mt-5 mb-3 font-semibold">What does Scoopika offer?</div>
        <p className="text-sm opacity-90 mt-2 mb-6">
          Scoopika provides an SDK that allows you to easily run these models in
          your application using a universal API. Here are the key features:
        </p>
        <div className="flex flex-col gap-3">
          <CheckItem title="Accept audio input and respond with audio, even if the model itself doesn't support it" />
          <CheckItem title="Generate JSON objects with output validation from mutliple data sources (text, audio, images, and urls)" />
          <CheckItem title="Accept URLs as inputs" />
          <CheckItem title="Maintain conversation context by passing session IDs" />
          <CheckItem title="Expand the model's knowledge base with any data you want (from files & websites)" />
        </div>
      </div> */}
    </>
  );
}

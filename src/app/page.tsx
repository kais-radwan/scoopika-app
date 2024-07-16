import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AgentData } from "@scoopika/types";
import { Session, getServerSession } from "next-auth";
import { Suspense } from "react";
import AppHead from "@/components/main/head";
import Loading from "@/components/main/loading";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { FaBook, FaGithub } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import { TbWorldBolt } from "react-icons/tb";
import { LuExternalLink } from "react-icons/lu";
import Footer from "@/components/footer";
import { Metadata } from "next";
import OnBoard from "@/components/main/onboard";
import { IoMdSettings } from "react-icons/io";
import Code from "@/components/main/code";
import StartCode from "@/components/main/startCode";

interface Props {
  session: Session;
}

export const metadata: Metadata = {
  title: "Overview"
}

const developerResources: {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}[] = [
    {
      name: "Documentation",
      description:
        "Clear in-depth documentation for how to use Scoopika and integrate it in your application for both server-side and client-side use",
      link: "https://docs.scoopika.com",
      icon: <FaBook size={17} />,
    },
    {
      name: "Web integration",
      description:
        "Learn how to build AI-powered web applications with Scoopika and how to run agents on the client-side with real-time streaming and client-side actions",
      link: "https://docs.scoopika.com/guides/scoopika-for-the-web",
      icon: <TbWorldBolt size={19} />,
    },
    {
      name: "Open-source",
      description:
        "99% of Scoopika is open-sourced. Check the repositories of Scoopika to report issues, help us improve Scoopika, or just check how the code works",
      link: "https://github.com/scoopika",
      icon: <FaGithub size={19} />,
    },
  ];

const Home = async ({ session }: Props) => {
  const agents = await db.agent.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const tokens = await db.token.findMany({
    where: {
      userId: session.user.id
    }
  })

  return (
    <>
      <AppHead
        title={`Let's get you started, ${session.user.name}`}
        description="Welcome back to your AI portal"
      />

      <div className="w-full flex flex-col gap-5">
        <OnBoard checked={agents.length > 0} required={true} title="Create your first AI bot/agent">
          <div className="text-xs">
            Create an AI agent with custom personality and APIs to add it to your application and allow users to interact with your app in natural language
          </div>
          <Button as={Link} href="/new-agent" color="primary" size="sm" className="mt-6 font-semibold">
            Create new AI agent
          </Button>
        </OnBoard>

        <OnBoard checked={tokens.length > 0} title="Generate access token">
          <div className="text-xs">
            Generate an access token and keep it safe so you can use Scoopika in your application. we recommend adding it to your .env file as <b>SCOOPIKA_TOKEN</b>
          </div>
          <div className="p-3 rounded-md bg-accent text-sm mt-4 flex items-center gap-3">
            <IoMdSettings />
            Click on the settings icon and generate an access token
          </div>
        </OnBoard>

        <OnBoard checked={false} title="Use Scoopika in your app">
          <div className="text-xs">
            We have Typescript packages for server-side, client-side, and React! Pick the way you want to do it:
          </div>
          <StartCode />
        </OnBoard>
      </div>

      <div className="pt-8 dark:border-accent/60">
        <div className="w-full rounded-2xl pb-5 mb-4">
          <h3 className="text-lg font-semibold mb-2">Resources</h3>
          <div className="text-sm opacity-80 mb-8">
            Integrate and use Scoopika agents in your application. open-source,
            type-safe, free, and easy to start!
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Button
              size="sm"
              color="primary"
              as={Link}
              href="https://docs.scoopika.com/quickstart"
              target="_blank"
              className="font-semibold"
              endContent={<FaExternalLinkAlt />}
            >
              Follow 2-minutes guide
            </Button>
            <Button
              size="sm"
              variant="flat"
              as={Link}
              href="https://docs.scoopika.com"
              target="_blank"
              className="font-semibold"
              startContent={<FaBook />}
              endContent={<FaExternalLinkAlt />}
            >
              Check documentation
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex gap-4">
          {developerResources.map((r, index) => (
            <Link
              key={`developerresourceitem-${index}`}
              href={r.link}
              target="_blank"
              className="p-5 border-1 rounded-2xl bg-accent/20 hover:border-black/20 dark:hover:border-white/20 min-h-max transition-all relative group"
            >
              <div className="w-10 h-10 flex items-center justify-center border-1 rounded-2xl bg-accent/20 mb-5">
                {r.icon}
              </div>
              <div className="h-full flex flex-col">
                <div className="font-semibold mb-1">{r.name}</div>
                <div className="text-sm opacity-80">{r.description}</div>
              </div>
              <LuExternalLink className="absolute top-4 right-4 scale-0 group-hover:scale-100 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session;

  return (
    <Suspense fallback={<Loading />}>
      <Home session={session} />
    </Suspense>
  );
}

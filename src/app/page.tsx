import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Session, getServerSession } from "next-auth";
import { Suspense } from "react";
import AppHead from "@/components/main/head";
import Loading from "@/components/main/loading";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { Metadata } from "next";
import {
  IconBook,
  IconBrandGithub,
  IconExternalLink,
  IconHelp,
  IconLayout2,
  IconPennant2,
  IconSparkles,
  IconTelescope,
} from "@tabler/icons-react";

interface Props {
  session: Session;
}

export const metadata: Metadata = {
  title: "Overview",
};

const developerResources: {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "Documentation",
    description:
      "Full Docs on how to build LLM-powered applications using Scoopika",
    link: "https://docs.scoopika.com",
    icon: <IconBook size={17} />,
  },
  {
    name: "Templates & Examples",
    description:
      "We've created several templates and examples using Scoopika, all available on GitHub for you to get started with",
    link: "https://docs.scoopika.com/templates",
    icon: <IconLayout2 size={17} />,
  },
  {
    name: "Open Source",
    description:
      "Want to contribute to Scoopika? you're welcome! check out our Github account and start building with us today!",
    link: "https://github.com/scoopika",
    icon: <IconBrandGithub size={19} />,
  },
];

const Card = ({
  title,
  description,
  link,
  target,
  icon,
}: {
  title: string;
  description: string;
  link: string;
  target?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Link
      href={link}
      target={target}
      className="w-full p-4 border rounded-xl bg-accent/10 flex flex-col gap-2 hover:bg-accent/20 shadow hover:border-black/20 dark:hover:border-white/20"
    >
      {icon && (
        <div className="min-w-8 max-w-8 min-h-8 max-h-8 border rounded-md flex items-center justify-center bg-accent/10 mb-2">
          {icon}
        </div>
      )}
      <div className="text-sm">{title}</div>
      <div className="text-xs opacity-70">{description}</div>
    </Link>
  );
};

const Home = async ({ session }: Props) => {
  const agents = [];

  const tokens = await db.token.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const keys = await db.apikeys.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <>
      <AppHead
        title={`Home`}
        description={`Welcome to Scoopika, ${session.user.name}!`}
      />

      <div className="w-full flex flex-col gap-5 p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex gap-4 mb-6">
          <Card
            title="Getting Started"
            description="Pick your framework and start building LLM-powered applications with Scoopika today!"
            link="/getting-started"
            icon={<IconPennant2 size={18} />}
          />
          <Card
            title="Features"
            description="A non-exhaustive list of features that Scoopika provides for every project"
            link="https://docs.scoopika.com/features"
            target="_blank"
            icon={<IconSparkles size={18} />}
          />
          <Card
            title="Need Help?"
            description="We're always here for you! if you ever feel stuck or need any help, just let us know ;)"
            link="https://docs.scoopika.com/help/contact-us"
            target="_blank"
            icon={<IconHelp size={18} />}
          />
        </div>
        <div className="p-6 pt-10 border-t-1 w-full flex gap-10 dark:border-accent/60">
          <div className="w-full flex flex-col gap-3">
            <div className="font-semibold text-xl">New to Scoopika?</div>
            <div className="opacity-80 text-sm">
              Let us help you begin your journey with us! Whether {"you're"} new to
              AI and LLMs or an expert, we welcome you. You only need a basic
              understanding of JavaScript to start using Scoopika.
            </div>
            <div className="text-sm opacity-80">
              Our guides will provide you with a solid foundation before you
              dive deeper into our world. You {"won't"} find any code in these
              guides, just essential knowledge to get you started!
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center w-full gap-2 mt-3">
              <Button
                size="sm"
                variant="light"
                className="border font-semibold"
                endContent={<IconExternalLink size={18} />}
                as={Link}
                href="https://docs.scoopika.com/foundations"
                target="_blank"
              >
                {"I'm new to AI"}
              </Button>
              <Button
                size="sm"
                variant="light"
                className="border font-semibold"
                endContent={<IconExternalLink size={18} />}
                as={Link}
                href="https://docs.scoopika.com/quickstart"
                target="_blank"
              >
                {"I've built AI apps before"}
              </Button>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="w-36 h-36 relative flex items-center justify-center rotate-[-20deg]">
              <div className="w-full absolute top-2 left-0 border-t-1 border-dashed border-black/70 dark:border-white/20"></div>
              <div className="w-full absolute bottom-2 left-0 border-t-1 border-dashed border-black/70 dark:border-white/20"></div>
              <div className="h-full absolute top-0 left-2 border-r-1 border-dashed border-black/70 dark:border-white/20"></div>
              <div className="h-full absolute top-0 right-2 border-r-1 border-dashed border-black/70 dark:border-white/20"></div>
              <IconTelescope size={55} />
              <div
                className="absolute blur-xl min-w-2 h-2 p-1"
                style={{
                  boxShadow: "0px 0px 20px 8px rgba(255, 255, 255, .9)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="dark:border-accent/60 p-6 border-t-1">
          <div className="w-full rounded-2xl flex flex-col gap-3">
            <h3 className="font-semibold text-xl">Resources</h3>
            <div className="text-sm opacity-80">
              Resources for developers building AI applications or looking to
              contribute to Scoopika
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex gap-4 mb-6 mt-6">
            {developerResources.map((r, index) => (
              <Card
                key={`resources-${r.name}-${index}`}
                title={r.name}
                description={r.description}
                link={r.link}
                target="_target"
                icon={r.icon}
              />
            ))}
          </div>
        </div>
      </div>
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

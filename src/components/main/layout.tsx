"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import SvgLogo from "./logo";
import { ThemeToggleRow } from "../themeToggle";
import { FaBook } from "react-icons/fa6";
import { Session } from "next-auth";
import { readPlan } from "@/scripts/plan";
import Settings from "./settings";
import UpgradeDialog from "./upgradeDialog";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { RiMenu3Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialog";
import SignInButtons from "../signInButtons";
import {
  IconBook,
  IconBooks,
  IconChartBar,
  IconCode,
  IconCube3dSphere,
  IconDatabaseSmile,
  IconHelp,
  IconHome,
  IconMessage2Code,
  IconPennant2,
} from "@tabler/icons-react";

interface Props {
  children: React.ReactNode;
  session: Session | null;
}

interface SideLink {
  type: "link";
  name: string;
  target?: string;
  path: string;
  icon: React.ReactElement;
  tag?: string;
}

type SideItem = SideLink;

const links: SideItem[] = [
  {
    type: "link",
    name: "Home",
    path: "/",
    icon: <IconHome size={20} className="opacity-80" />,
  },
  {
    type: "link",
    name: "LLM Providers",
    path: "/llm-providers",
    icon: <IconCube3dSphere size={20} className="opacity-80" />,
  },
  // {
  //   type: "link",
  //   name: "AI Bots (agents)",
  //   path: "/agents",
  //   icon: <RiRobot2Fill size={16} />,
  // },
  {
    type: "link",
    name: "Memory Stores",
    path: "/data-stores",
    icon: <IconDatabaseSmile size={20} className="opacity-80" />,
  },
  {
    type: "link",
    name: "Knowledge Stores",
    path: "/knowledge",
    icon: <IconBooks size={20} className="opacity-80" />,
  },
  // {
  //   type: "link",
  //   name: "Widgets",
  //   path: "/widgets",
  //   icon: <MdWidgets size={15} />,
  //   tag: "new",
  // },
  // {
  //   type: "link",
  //   name: "Playground",
  //   path: "/playground",
  //   icon: <IconMessage2Code size={20} className="opacity-80" />,
  // },
  {
    type: "link",
    name: "Getting Started",
    path: "/getting-started",
    icon: <IconPennant2 size={20} className="opacity-80" />,
  },
  {
    type: "link",
    name: "Plan & Usage",
    path: "/usage",
    icon: <IconChartBar size={20} className="opacity-80" />,
  },
];

const downLinks: SideItem[] = [
  {
    name: "Documentation",
    icon: <IconBook size={20} />,
    path: "https://docs.scoopika.com",
    target: "_blank",
    type: "link",
  },
];

export default function MainLayout({ children, session }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [path, setPath] = useState<string>("");
  const plan = readPlan(session?.user?.plan || "none");
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setPath((pathname || "").replace("/app", ""));
  }, [pathname]);

  if (!session) {
    return (
      <Dialog open={true}>
        <DialogContent>
          <div className="font-bold">Sign in</div>
          <p className="text-sm opacity-80">Connect your account to continue</p>
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <SignInButtons callbackUrl="/" />
          </div>
          <p className="text-sm mt-4">
            By continue you agree to our{" "}
            <Link
              href="/privacy_policy.pdf"
              target="_blank"
              className="underline"
            >
              Privacy policy
            </Link>
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex p-4 pl-0 bg-accent dark:bg-accent/35">
      {/* Desktop navbar */}
      <div
        className={`min-h-screen h-full min-w-64 max-w-64 text-foreground hidden lg:block p-4 pb-10 top-0 left-0 z-50`}
      >
        <div className="w-full flex items-center gap-2 mb-4 pl-1 pr-1 pt-1">
          <div className="w-full flex items-center text-xs">
            <div className="w-9 h-9 overflow-hidden rounded-xl bg-white flex items-center justify-center pt-1">
              <SvgLogo />
            </div>
            <div className="text-sm font-semibold ml-2">Scoopika</div>
          </div>
          <Settings session={session} />
        </div>
        {plan.type === "free" && (
          <UpgradeDialog
            title="Upgrade plan"
            price={false}
            className="hidden md:flex w-full mb-4"
          />
        )}
        {links.map((link, index) => (
          <Link
            href={link.path}
            key={`side-link-${index}`}
            target={link.target}
            className={`p-2 pl-3 pr-3 flex items-center gap-2 text-xs font-semibold transition-all border ${
              path === link.path
                ? "border-border/90 bg-background dark:bg-accent/30 shadow"
                : "border-transparent hover:bg-black/5 dark:hover:bg-accent/60"
            } rounded-sm mb-1 group`}
            onClick={() => setPath(link.path)}
          >
            <div
              className={`flex items-center gap-2 ${
                path === link.path ? "opacity-100" : "opacity-60"
              } group-hover:opacity-80`}
            >
              {link.icon} {link.name}{" "}
              {link.tag && (
                <span className="text-xs pl-2 pr-2 rounded-full border border-violet-400 text-violet-400">
                  {link.tag}
                </span>
              )}
            </div>
          </Link>
        ))}
        <div className="w-64 p-4 absolute left-0 bottom-6 hidden lg:block">
          {downLinks.map((link, index) => (
            <Link
              href={link.path}
              key={`side-link-${index}`}
              target={link.target}
              className={`p-2 pl-3 pr-3 flex items-center gap-2 text-xs font-semibold transition-all border ${
                path === link.path
                  ? "border-border/70 bg-accent/30 shadow"
                  : "border-transparent hover:bg-black/5 dark:hover:bg-accent/60"
              } rounded-sm mb-1 group`}
            >
              <div
                className={`flex items-center gap-2 ${
                  path === link.path ? "opacity-100" : "opacity-60"
                } group-hover:opacity-80`}
              >
                {link.icon} {link.name}{" "}
                {link.tag && (
                  <span className="text-xs pl-2 pr-2 rounded-full border border-violet-400 text-violet-400">
                    {link.tag}
                  </span>
                )}
              </div>
            </Link>
          ))}
          <div className="pt-3 mt-4 border-t-1 dark:border-accent/70">
            <ThemeToggleRow />
          </div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col border-1 border-border/60 dark:border-border bg-white dark:bg-[#090909] border rounded-2xl overflow-hidden relative shadow-lg">
        <div className="h-full w-full overflow-auto flex flex-col gap-8">
          {children}
        </div>
        <div className="hidden bg-white dark:bg-[#090909] h-6 blur-xl"></div>
        <div className="hidden w-full flex flex-col items-center justify-center gap-6 pt-6">
          {/* <div className="h-1 w-24 bg-border rounded-full"></div> */}
          <div className="flex items-center justify-center gap-8 ">
            {links.map((link, index) => (
              <Tooltip
                key={`link-${index}`}
                content={link.name}
                size="sm"
                className="bg-accent/40 backdrop-blur text-xs border-0 rounded-md"
              >
                <Link
                  href={link.path}
                  className={`flex flex-col gap-4 transition-all cursor-pointer ${
                    path === link.path
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-80"
                  }`}
                >
                  <div>{link.icon}</div>
                  <div
                    style={
                      path === link.path
                        ? {
                            boxShadow:
                              "0px 0px 20px 0px rgba(255, 255, 255, .8)",
                          }
                        : {}
                    }
                    className={`w-full rounded-t-2xl h-0.5 ${
                      path === link.path ? "bg-foreground" : ""
                    }`}
                  ></div>
                </Link>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

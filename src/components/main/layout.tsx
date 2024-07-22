"use client";

import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaBrain, FaDatabase } from "react-icons/fa6";
import { RiRobot2Fill } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link";
import SvgLogo from "./logo";
import { ThemeToggleRow } from "../themeToggle";
import { FaBook } from "react-icons/fa6";
import { FaChartSimple } from "react-icons/fa6";
import { Session } from "next-auth";
import { readPlan } from "@/scripts/plan";
import Settings from "./settings";
import UpgradeDialog from "./upgradeDialog";
import { HiChatAlt2 } from "react-icons/hi";
import { RiChatVoiceFill } from "react-icons/ri";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { RiMenu3Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialog";
import SignInButtons from "../signInButtons";
import { IoLibrary } from "react-icons/io5";

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
    name: "Getting Started",
    path: "/",
    icon: <AiFillHome size={16} />,
  },
  {
    type: "link",
    name: "LLM Providers",
    path: "/llm-providers",
    icon: <FaBrain size={16} />,
  },
  {
    type: "link",
    name: "AI Bots (agents)",
    path: "/agents",
    icon: <RiRobot2Fill size={16} />,
  },
  {
    type: "link",
    name: "Memory Stores",
    path: "/data-stores",
    icon: <FaDatabase size={15} />,
  },
  {
    type: "link",
    name: "Knowledge Stores",
    path: "/knowledge",
    icon: <IoLibrary size={15} />,
  },
  // {
  //   type: "link",
  //   name: "Widgets",
  //   path: "/widgets",
  //   icon: <MdWidgets size={15} />,
  //   tag: "new",
  // },
  {
    type: "link",
    name: "Playground",
    path: "/playground",
    icon: <RiChatVoiceFill size={18} className="font-semibold" />,
  },
  {
    type: "link",
    name: "Plan & Usage",
    path: "/usage",
    icon: <FaChartSimple size={15} />,
  },
];

const downLinks: SideItem[] = [
  {
    name: "Documentation",
    icon: <FaBook />,
    path: "https://docs.scoopika.com",
    target: "_blank",
    type: "link",
  },
  {
    name: "Support",
    icon: <HiChatAlt2 size={17} />,
    path: "https://docs.scoopika.com/help/contact-us",
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
    <div className=" w-full min-h-screen max-h-screen overflow-auto flex flex-col pb-36 pt-20 lg:pt-0">
      <div className="fixed w-full pl-6 pr-6 min-h-16 max-h-16 flex items-center z-50 lg:hidden bg-background md:border-b-1 top-0 left-0">
        <div className="w-full flex items-center text-sm pl-2">
          <div className="w-9 h-9 overflow-hidden rounded-xl bg-white flex items-center justify-center pt-1">
            <SvgLogo />
          </div>
          <div className="font-semibold ml-3">Scoopika</div>
        </div>
        <div className="min-w-max flex items-center justify-end gap-4">
          {plan.type === "free" && (
            <UpgradeDialog
              title="Upgrade plan"
              price={false}
              className="hidden md:flex"
            />
          )}
          <Button
            size="sm"
            variant="bordered"
            className="border-1 dark:border-white/20 hidden md:flex"
            startContent={<FaBook />}
            as={Link}
            href="https://docs.scoopika.com"
            target="_blank"
          >
            Docs
          </Button>
          <Settings session={session} />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                size="sm"
                isIconOnly
                variant="light"
                startContent={<RiMenu3Fill size={16} />}
              />
            </SheetTrigger>
            <SheetContent>
              <div className="pb-6 mb-4 w-full flex flex-col gap-2 border-b-1 mt-4">
                {links.map((link, index) => (
                  <Link
                    href={link.path}
                    key={`side-link-${index}`}
                    target={link.target}
                    className={`p-1.5 pl-2 flex items-center gap-2 text-sm ${
                      path === link.path
                        ? "hover:bg-purple-400/20 dark:hover:bg-purple-400/5"
                        : "hover:bg-black/5 dark:hover:bg-accent/60"
                    } rounded-md mb-1 group`}
                    onClick={() => {
                      setPath(link.path);
                      setSheetOpen(false);
                    }}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        path === link.path
                          ? "text-purple-400 opacity-100"
                          : "opacity-70"
                      } group-hover:opacity-100`}
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
                {plan.type === "free" && (
                  <UpgradeDialog title="Upgrade plan" price={false} />
                )}
              </div>
              <ThemeToggleRow />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop navbar */}
      <div
        className={`w-full flex h-full ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-24"
        } transition-all`}
      >
        <div
          className={`fixed w-full min-h-screen max-h-screen min-w-64 max-w-64 text-foreground hidden lg:block p-4 top-0 left-0 z-50 bg-accent dark:bg-accent/20 border-r-1`}
        >
          <div className="w-full flex items-center gap-2 mb-6 pl-1 pr-1 pt-1">
            <div className="w-full flex items-center text-xs">
              <div className="w-8 h-8 overflow-hidden rounded-xl bg-white flex items-center justify-center pt-1">
                <SvgLogo />
              </div>
              <div className="text-sm font-semibold ml-2">Scoopika</div>
            </div>
            <Settings session={session} />
          </div>
          {links.map((link, index) => (
            <Link
              href={link.path}
              key={`side-link-${index}`}
              target={link.target}
              className={`p-1.5 pl-2 flex items-center gap-2 text-sm ${
                path === link.path
                  ? "hover:bg-purple-400/20 dark:hover:bg-purple-400/5"
                  : "hover:bg-black/5 dark:hover:bg-accent/60"
              } rounded-md mb-1 group`}
              onClick={() => setPath(link.path)}
            >
              <div
                className={`flex items-center gap-2 ${
                  path === link.path
                    ? "text-purple-400 opacity-100"
                    : "opacity-70"
                } group-hover:opacity-100`}
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
          <div className="w-64 p-4 absolute left-0 bottom-0">
            {downLinks.map((link, index) => (
              <Link
                href={link.path}
                key={`side-down-link-${index}`}
                target={link.target}
                className={`p-1.5 pl-2 flex items-center gap-2 text-sm hover:bg-black/5 dark:hover:bg-accent/60 rounded-md mb-1 group`}
              >
                <div
                  className={`flex items-center gap-2 opacity-70 group-hover:opacity-100`}
                >
                  {link.icon} {link.name}{" "}
                </div>
              </Link>
            ))}
            {plan.type === "free" && (
              <UpgradeDialog
                title="Upgrade plan"
                price={false}
                className="hidden md:flex w-full mt-3"
              />
            )}
            <div className="pt-3 mt-4 border-t-1 dark:border-accent/70">
              <ThemeToggleRow />
            </div>
          </div>
        </div>

        <div className="w-full bg-background">
          <div className="p-5 md:p-9 md:pl-10 pb-0 relative overflow-hidden flex flex-col gap-8 rounded-2xl md:rounded-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

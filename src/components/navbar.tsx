"use client";

import { FC, useState } from "react";
import {
  Navbar as NextNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/react";
import ThemeToggle from "./themeToggle";
import Logo from "./logo";
import { Session } from "next-auth";
import Icons from "@/components/icons";
import UserDropdown from "@/components/userDropdown";
import NavItem, { type Item } from "@/components/navItem";
import NextLink from "next/link";

interface Props {
  active?: string;
  items?: Item[];
  session: Session | null;
  children?: React.ReactNode;
  path?: string;
  disabled?: boolean;
}

const initialItems: Props["items"] = [
  { name: "Home", href: "/", type: "link" },
  { name: "Dashboard", href: "/app", type: "link" },
  { name: "Pricing", href: "/pricing", type: "link" },
  {
    name: "Docs",
    href: "https://docs.scoopika.com",
    type: "link",
    target: "_blank",
  },
];

const Navbar: FC<Props> = ({ items, active, session, children, path }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!items) {
    items = initialItems;
  }

  return (
    <NextNavbar
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
      className="fixed backdrop-blur-xl border-b-1 z-50"
      classNames={{
        wrapper: "min-w-full justify-between",
        content: "",
      }}
    >
      <NavbarContent>
        <div className="flex items-center h-full w-full">
          <NavbarBrand
            className="mr-6"
            as={NextLink}
            href={path ? `/${path}` : "/"}
          >
            <Logo />
            <p className="font-semibold text-inherit text-sm ml-2">Scoopika</p>
            {path && <p className="text-xs opacity-60 mb-2">{path}</p>}
          </NavbarBrand>
        </div>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <div className="hidden sm:flex items-center justify-center w-full gap-4">
          {items?.length &&
            items.map((item) => (
              <NavbarItem key={`nav-item-${item.name}`}>
                <NavItem item={item} active={active} />
              </NavbarItem>
            ))}
        </div>
        {children && children}
      </NavbarContent>
      <NavbarContent justify="end">
        <div className="hidden md:flex">
          <ThemeToggle />
        </div>
        {!session ? (
          <Button
            color="primary"
            size="sm"
            endContent={<Icons.ChevronRIghtIcon size={18} />}
            className="font-semibold"
            as={Link}
            href="/login"
          >
            Log in
          </Button>
        ) : (
          <Button
            color="primary"
            size="sm"
            endContent={<Icons.ChevronRIghtIcon size={18} />}
            className="font-semibold"
            as={Link}
            href="/app"
          >
            App
          </Button>
        )}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarMenu>
        {items?.length &&
          items.map((item) => (
            <NavbarItem key={`nav-item-${item.name}`}>
              <Button
                as={Link}
                size="sm"
                color="default"
                variant="light"
                href={item.href}
                className="text-[0.85rem] w-full border-t-1 rounded-none border-black/10 dark:border-border"
              >
                {item.name}
              </Button>
            </NavbarItem>
          ))}
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </NavbarMenu>
    </NextNavbar>
  );
};

function GetIcon({ name }: { name: keyof typeof Icons }) {
  const Icon = Icons[name];
  if (!Icon) {
    return null;
  }
  return <Icon size={17} />;
}

export { type Props };
export default Navbar;

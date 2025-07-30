"use client";

import { usePathname } from "next/navigation";

import { Button, Link } from "@heroui/react";
import {
  IconBallBaseball,
  IconHome,
  IconPackage,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";

import AuthButton from "./auth-button";
import { ThemeSwitcher } from "./theme-switcher";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { status } = useSession();
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Home",
      href: "/",
      icon: IconHome,
    },
  ];

  if (status === "authenticated") {
    menuItems.push(
      {
        label: "Profile",
        href: "/profile",
        icon: IconUser,
      },
      {
        label: "Players",
        href: "/players",
        icon: IconUsers,
      },
      {
        label: "Create Lesson",
        href: "/create-lesson",
        icon: IconBallBaseball,
      }
    );
  }

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full transform border-r border-divider bg-background transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} flex w-64 flex-col lg:static lg:z-auto lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-divider p-4">
          <div className="flex items-center gap-2">
            <IconPackage className="text-primary" size={24} />
            <span className="font-bold text-foreground">
              5 Tool Performance
            </span>
          </div>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onPress={onToggle}
          >
            <IconX size={20} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActiveLink(item.href);

              return (
                <li key={`${item.label}-${index}`}>
                  <Link
                    href={item.href}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 ${
                      active
                        ? "border-l-2 border-primary bg-primary/10 text-primary"
                        : "text-foreground-600 hover:bg-default-100 hover:text-foreground"
                    } `}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="space-y-3 border-t border-divider p-4">
          <div className="flex items-center justify-center">
            <ThemeSwitcher showLabel />
          </div>
          <div className="flex justify-center">
            <AuthButton minimal={false} />
          </div>
        </div>
      </div>
    </>
  );
}

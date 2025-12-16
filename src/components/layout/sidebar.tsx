"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Link } from "@heroui/react";
import {
  Icon3dCubeSphereOff,
  IconBallBaseball,
  IconChevronDown,
  IconHome,
  IconPackage,
  IconShieldLock,
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
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const menuItems = [
    {
      label: "Home",
      href: "/",
      icon: IconHome,
      target: "_self",
    },
  ];

  if (status === "authenticated") {
    menuItems.push(
      {
        label: "Profile",
        href: "/profile",
        icon: IconUser,
        target: "_self",
      },
      {
        label: "Players",
        href: "/players",
        icon: IconUsers,
        target: "_self",
      },
      {
        label: "Create Lesson",
        href: "/create-lesson",
        icon: IconBallBaseball,
        target: "_self",
      },
      {
        label: "Log Writeup",
        href: "/player-writeups",
        icon: IconBallBaseball,
        target: "_self",
      },
      {
        label: "Feedback",
        href: "https://forms.office.com/r/parLxEE76t",
        icon: Icon3dCubeSphereOff,
        target: "_blank",
      }
    );
  }

  const adminLinks = [
    {
      label: "External Sync",
      href: "/admin/external-sync",
    },
    {
      label: "Unmatched Exams",
      href: "/admin/unmatched-exams",
    },
  ];

  const adminHasActiveChild = adminLinks.some((link) =>
    isActiveLink(link.href)
  );
  const [adminExpanded, setAdminExpanded] = useState(adminHasActiveChild);

  useEffect(() => {
    if (adminHasActiveChild) {
      setAdminExpanded(true);
    }
  }, [adminHasActiveChild]);

  const showAdminSection =
    status === "authenticated" && session?.user?.role === "admin";

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
                    target={item.target}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            {showAdminSection && (
              <li>
                <button
                  type="button"
                  onClick={() => setAdminExpanded((prev) => !prev)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-200 ${
                    adminExpanded || adminHasActiveChild
                      ? "border-l-2 border-primary bg-primary/10 text-primary"
                      : "text-foreground-600 hover:bg-default-100 hover:text-foreground"
                  }`}
                >
                  <IconShieldLock size={20} />
                  <span className="flex-1">Admin</span>
                  <IconChevronDown
                    size={16}
                    className={`transition-transform ${
                      adminExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {adminExpanded && (
                  <ul className="mt-1 space-y-1">
                    {adminLinks.map((link) => {
                      const childActive = isActiveLink(link.href);

                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 ${
                              childActive
                                ? "border-l-2 border-primary bg-primary/10 text-primary"
                                : "text-foreground-600 hover:bg-default-100 hover:text-foreground"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            )}
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

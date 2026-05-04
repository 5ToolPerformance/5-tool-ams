"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  IconBrain,
  IconHome2,
  IconMessageCircle,
  IconNotebook,
  IconSettings,
} from "@tabler/icons-react";

const items = [
  { href: "/", label: "Profile", icon: IconHome2 },
  { href: "/journal", label: "Journal", icon: IconNotebook },
  { href: "/messages", label: "Messages", icon: IconMessageCircle },
  { href: "/assistant", label: "AI", icon: IconBrain },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

export function PortalBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const playerId = searchParams.get("playerId");
  const query = playerId ? `?playerId=${encodeURIComponent(playerId)}` : "";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-default-200/80 bg-background/95 px-2 pb-5 pt-2 backdrop-blur dark:border-default-100/10">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={`${item.href}${query}`}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-default-500 hover:bg-default-100 hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { PortalBottomNav } from "./PortalBottomNav";

export function PortalLayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const showNav =
    !pathname.startsWith("/invite") &&
    Boolean(session?.user?.isPortalClient);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f4efe2,transparent_40%),linear-gradient(180deg,#fffdf8_0%,#f5f1e8_100%)] text-foreground dark:bg-[radial-gradient(circle_at_top,#262118,transparent_35%),linear-gradient(180deg,#0e0f11_0%,#141519_100%)]">
      <div className={showNav ? "pb-24" : ""}>{children}</div>
      {showNav ? <PortalBottomNav /> : null}
    </div>
  );
}


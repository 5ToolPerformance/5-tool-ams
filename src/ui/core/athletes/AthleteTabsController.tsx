"use client";

import { usePathname, useRouter } from "next/navigation";

import { AthleteTabs } from "./AthleteTabs";

const TAB_KEYS = ["overview", "training", "performance", "health", "systems"];

export function AthleteTabsController() {
  const router = useRouter();
  const pathname = usePathname();

  const activeKey =
    TAB_KEYS.find((key) => pathname.endsWith(key)) ?? "overview";

  const playerId = pathname.split("/")[2];

  function handleChange(key: string) {
    router.push(`/players/${playerId}/${key}`);
  }

  return <AthleteTabs activeKey={activeKey} onChange={handleChange} />;
}

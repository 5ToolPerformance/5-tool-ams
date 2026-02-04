"use client";

import { usePathname, useRouter } from "next/navigation";

import { AthleteTabs } from "./AthleteTabs";

const TAB_KEYS = [
  "overview",
  "training",
  "performance",
  "context",
  "health",
  "systems",
];

export function AthleteTabsController() {
  const router = useRouter();
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const isPerformanceRoute = pathSegments.includes("performance");
  const lastSegment = pathSegments[pathSegments.length - 1];
  const activeKey = isPerformanceRoute
    ? "performance"
    : TAB_KEYS.includes(lastSegment ?? "")
      ? lastSegment
      : "overview";

  const playerId = pathSegments[1];

  function handleChange(key: string) {
    router.push(`/players/${playerId}/${key}`);
  }

  return <AthleteTabs activeKey={activeKey} onChange={handleChange} />;
}

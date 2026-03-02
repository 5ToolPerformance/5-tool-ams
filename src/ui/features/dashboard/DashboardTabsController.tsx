"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DashboardTabKey } from "@/domain/dashboard/types";

import { DashboardTabs } from "./DashboardTabs";

const TAB_KEYS: DashboardTabKey[] = ["overview", "coaches", "players", "systems"];
const ENABLED_TAB_KEYS: DashboardTabKey[] = ["overview", "coaches", "players"];

export function DashboardTabsController() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathSegments = pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const activeKey =
    TAB_KEYS.includes(lastSegment as DashboardTabKey)
      ? (lastSegment as DashboardTabKey)
      : "overview";

  function onChange(key: DashboardTabKey) {
    if (!ENABLED_TAB_KEYS.includes(key)) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString();
    router.push(query.length > 0 ? `/dashboard/${key}?${query}` : `/dashboard/${key}`);
  }

  return <DashboardTabs activeKey={activeKey} onChange={onChange} />;
}


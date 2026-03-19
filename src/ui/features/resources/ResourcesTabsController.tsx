"use client";

import { usePathname, useRouter } from "next/navigation";

import { ResourcesTabKey } from "@/domain/resources/types";

import { ResourcesTabs } from "./ResourcesTabs";

const TAB_KEYS: ResourcesTabKey[] = ["drills", "mechanics", "documentation"];
const ENABLED_TAB_KEYS: ResourcesTabKey[] = ["drills", "mechanics"];

export function ResourcesTabsController() {
  const router = useRouter();
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const activeKey = TAB_KEYS.includes(lastSegment as ResourcesTabKey)
    ? (lastSegment as ResourcesTabKey)
    : "drills";

  function onChange(key: ResourcesTabKey) {
    if (!ENABLED_TAB_KEYS.includes(key)) {
      return;
    }

    router.push(`/resources/${key}`);
  }

  return <ResourcesTabs activeKey={activeKey} onChange={onChange} />;
}

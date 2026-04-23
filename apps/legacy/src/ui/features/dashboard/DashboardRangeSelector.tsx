"use client";

import { Tab, Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DashboardRangeKey } from "@/domain/dashboard/types";

const RANGE_OPTIONS: Array<{ key: DashboardRangeKey; label: string }> = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "all", label: "All time" },
];

export function DashboardRangeSelector({ selectedKey }: { selectedKey: DashboardRangeKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(range: DashboardRangeKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Tabs
      selectedKey={selectedKey}
      onSelectionChange={(key) => onChange(String(key) as DashboardRangeKey)}
      variant="underlined"
      className="border-b border-divider"
    >
      {RANGE_OPTIONS.map((option) => (
        <Tab key={option.key} title={option.label} />
      ))}
    </Tabs>
  );
}


"use client";

import { Tab, Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TimeRangeOption = {
  key: string;
  label: string;
};

export const DEFAULT_TIME_RANGES: TimeRangeOption[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "season", label: "Season" },
];

interface TimeRangeSelectorProps {
  ranges?: TimeRangeOption[];
  selectedKey?: string;
  queryKey?: string;
  onChange?: (key: string) => void;
}

export function TimeRangeSelector({
  ranges = DEFAULT_TIME_RANGES,
  selectedKey,
  queryKey = "range",
  onChange,
}: TimeRangeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (ranges.length === 0) {
    return null;
  }

  const activeKey = selectedKey ?? searchParams.get(queryKey) ?? ranges[0]?.key;

  function handleSelection(key: string) {
    if (onChange) {
      onChange(key);
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set(queryKey, key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Tabs
      selectedKey={activeKey}
      onSelectionChange={(key) => handleSelection(String(key))}
      variant="underlined"
      className="border-b border-divider"
    >
      {ranges.map((range) => (
        <Tab key={range.key} title={range.label} />
      ))}
    </Tabs>
  );
}

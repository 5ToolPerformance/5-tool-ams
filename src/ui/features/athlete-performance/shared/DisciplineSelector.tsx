"use client";

import { Tab, Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type DisciplineOption = {
  key: string;
  label: string;
};

export const DEFAULT_DISCIPLINES: DisciplineOption[] = [
  { key: "hitting", label: "Hitting" },
  { key: "pitching", label: "Pitching" },
  { key: "fielding", label: "Fielding" },
  { key: "strength", label: "Strength" },
  { key: "recovery", label: "Recovery" },
];

interface DisciplineSelectorProps {
  disciplines?: DisciplineOption[];
  selectedKey?: string;
  queryKey?: string;
  onChange?: (key: string) => void;
}

export function DisciplineSelector({
  disciplines = DEFAULT_DISCIPLINES,
  selectedKey,
  queryKey = "discipline",
  onChange,
}: DisciplineSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (disciplines.length === 0) {
    return null;
  }

  const activeKey =
    selectedKey ?? searchParams.get(queryKey) ?? disciplines[0]?.key;

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
      {disciplines.map((discipline) => (
        <Tab key={discipline.key} title={discipline.label} />
      ))}
    </Tabs>
  );
}

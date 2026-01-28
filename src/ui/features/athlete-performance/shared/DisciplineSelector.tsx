"use client";

import { Tab, Tabs } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

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
  onChange,
}: DisciplineSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  if (disciplines.length === 0) {
    return null;
  }

  const lastSegment = pathSegments[pathSegments.length - 1];
  const availableKeys = new Set(disciplines.map((discipline) => discipline.key));
  const activeKey =
    (selectedKey && availableKeys.has(selectedKey)
      ? selectedKey
      : availableKeys.has(lastSegment ?? "")
        ? lastSegment
        : disciplines[0]?.key) ?? "";

  function handleSelection(key: string) {
    if (onChange) {
      onChange(key);
      return;
    }

    const playerId = pathSegments[1];
    if (!playerId) {
      return;
    }
    router.push(`/players/${playerId}/performance/${key}`);
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

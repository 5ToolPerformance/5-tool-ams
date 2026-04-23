"use client";

import { Tab, Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { DevelopmentDisciplineOption } from "@/application/players/development/getPlayerDevelopmentTabData";

interface DevelopmentDisciplineSelectorProps {
  selectedDisciplineId: string | null;
  disciplines: DevelopmentDisciplineOption[];
}

export function DevelopmentDisciplineSelector({
  selectedDisciplineId,
  disciplines,
}: DevelopmentDisciplineSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (disciplines.length === 0 || !selectedDisciplineId) {
    return null;
  }

  function handleChange(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("discipline", key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Tabs
      selectedKey={selectedDisciplineId}
      onSelectionChange={(key) => handleChange(String(key))}
      variant="underlined"
      className="border-b border-divider"
    >
      {disciplines.map((discipline) => (
        <Tab key={discipline.id} title={discipline.label} />
      ))}
    </Tabs>
  );
}

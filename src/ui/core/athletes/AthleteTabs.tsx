"use client";

import { Tab, Tabs } from "@heroui/react";

interface AthleteTabsProps {
  activeKey: string;
  onChange: (key: string) => void;
}

export function AthleteTabs({ activeKey, onChange }: AthleteTabsProps) {
  return (
    <Tabs
      selectedKey={activeKey}
      onSelectionChange={(key) => onChange(String(key))}
      variant="underlined"
      className="border-b border-divider"
    >
      <Tab key="overview" title="Overview" />
      <Tab key="training" title="Training" />
      <Tab key="development" title="Development" />
      <Tab key="performance" title="Performance" />
      <Tab key="context" title="Context & Documents" />
      <Tab key="health" title="Health" />
    </Tabs>
  );
}

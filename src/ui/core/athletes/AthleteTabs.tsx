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
      <Tab key="performance" title="Performance" />
      <Tab key="health" title="Health" />
      <Tab key="systems" title="Systems" />
    </Tabs>
  );
}

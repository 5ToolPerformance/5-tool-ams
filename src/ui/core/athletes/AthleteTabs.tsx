"use client";

import { Tab, Tabs } from "@heroui/react";

interface AthleteTabsProps {
  activeKey: string;
  onChange: (key: string) => void;
}

function DisabledTab({ title }: { title: string }) {
  return (
    <div className="flex cursor-not-allowed items-center gap-2 opacity-40">
      <span>{title}</span>
      <span className="text-xs text-muted-foreground">(Coming soon)</span>
    </div>
  );
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
      <Tab key="health" title={<DisabledTab title="Health" />} isDisabled />
      <Tab key="systems" title={<DisabledTab title="Systems" />} isDisabled />
    </Tabs>
  );
}

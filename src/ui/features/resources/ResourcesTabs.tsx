"use client";

import { Tab, Tabs } from "@heroui/react";

import { ResourcesTabKey } from "@/domain/resources/types";

interface ResourcesTabsProps {
  activeKey: ResourcesTabKey;
  onChange: (key: ResourcesTabKey) => void;
}

function DisabledTabTitle({ title }: { title: string }) {
  return (
    <div className="flex cursor-not-allowed items-center gap-2 opacity-40">
      <span>{title}</span>
      <span className="text-xs text-muted-foreground">(Coming soon)</span>
    </div>
  );
}

export function ResourcesTabs({ activeKey, onChange }: ResourcesTabsProps) {
  return (
    <Tabs
      selectedKey={activeKey}
      onSelectionChange={(key) => onChange(String(key) as ResourcesTabKey)}
      variant="underlined"
      className="border-b border-divider"
    >
      <Tab key="drills" title="Drills" />
      <Tab key="mechanics" title="Mechanics" />
      <Tab key="routines" title="Routines" />
      <Tab
        key="documentation"
        title={<DisabledTabTitle title="Documentation" />}
        isDisabled
      />
    </Tabs>
  );
}

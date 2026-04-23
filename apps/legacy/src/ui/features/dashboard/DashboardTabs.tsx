"use client";

import { Tab, Tabs } from "@heroui/react";

import { DashboardTabKey } from "@/domain/dashboard/types";

interface DashboardTabsProps {
  activeKey: DashboardTabKey;
  onChange: (key: DashboardTabKey) => void;
}

function DisabledTabTitle({ title }: { title: string }) {
  return (
    <div className="flex cursor-not-allowed items-center gap-2 opacity-40">
      <span>{title}</span>
      <span className="text-xs text-muted-foreground">(Coming soon)</span>
    </div>
  );
}

export function DashboardTabs({ activeKey, onChange }: DashboardTabsProps) {
  return (
    <div className="overflow-x-auto border-b border-divider">
      <Tabs
        selectedKey={activeKey}
        onSelectionChange={(key) => onChange(String(key) as DashboardTabKey)}
        variant="underlined"
        classNames={{
          base: "min-w-max",
          tabList: "min-w-max flex-nowrap",
        }}
      >
        <Tab key="overview" title="Overview" />
        <Tab key="coaches" title="Coaches" />
        <Tab key="players" title="Players" />
        <Tab key="reports" title="Reports" />
        <Tab key="systems" title={<DisabledTabTitle title="Systems" />} isDisabled />
      </Tabs>
    </div>
  );
}


// ui/core/TabContentShell.tsx
import type { ReactNode } from "react";

interface TabContentShellProps {
  children: ReactNode;
}

export function TabContentShell({ children }: TabContentShellProps) {
  return <div className="space-y-6 pt-6">{children}</div>;
}

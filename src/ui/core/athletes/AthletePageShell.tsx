// ui/core/PlayerPageShell.tsx
import type { ReactNode } from "react";

interface AthletePageShellProps {
  children: ReactNode;
}

export function AthletePageShell({ children }: AthletePageShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">{children}</div>
    </div>
  );
}

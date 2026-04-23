"use client";

import type { LessonViewerSectionProps } from "./types";

export function LessonViewerSection({
  title,
  icon,
  children,
  className = "",
}: LessonViewerSectionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-zinc-400 dark:text-zinc-500">{icon}</span>
        )}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {title}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

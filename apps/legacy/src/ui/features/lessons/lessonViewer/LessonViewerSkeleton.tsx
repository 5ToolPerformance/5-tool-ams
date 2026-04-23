"use client";

import { Divider } from "@heroui/react";

export function LessonViewerSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700" />

      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
            <div className="space-y-2">
              <div className="h-7 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-36 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-10 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>

        <Divider className="dark:bg-zinc-800" />

        {/* Players section skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
              >
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider className="dark:bg-zinc-800" />

        {/* Mechanics section skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-36 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
              >
                <div className="flex justify-between">
                  <div className="h-5 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                </div>
                <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            ))}
          </div>
        </div>

        <Divider className="dark:bg-zinc-800" />

        {/* Notes section skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

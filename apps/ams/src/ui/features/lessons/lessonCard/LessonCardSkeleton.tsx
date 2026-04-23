"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
} from "@heroui/react";

export function LessonCardSkeleton() {
  return (
    <Card
      classNames={{
        base: "w-full animate-pulse border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
      }}
    >
      <div className="h-1 bg-zinc-200 dark:bg-zinc-700" />
      <CardHeader className="px-4 pt-4 sm:px-5">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <div className="space-y-2">
            <div className="h-6 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-3 px-4 sm:space-y-4 sm:px-5">
        <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <Divider className="dark:bg-zinc-800" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-6 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </CardBody>
    </Card>
  );
}

export function LessonCardListSkeleton({
  count = 5,
  maxHeight = "max-h-[calc(100vh-200px)]",
  className = "",
}: {
  count?: number;
  maxHeight?: string;
  className?: string;
}) {
  return (
    <ScrollShadow hideScrollBar className={`${maxHeight} ${className}`}>
      <div className="flex flex-col gap-3 pb-4 sm:gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <LessonCardSkeleton key={i} />
        ))}
      </div>
    </ScrollShadow>
  );
}

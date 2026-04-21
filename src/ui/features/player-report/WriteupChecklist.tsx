"use client";

import { useEffect, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

import { LessonSelect, WriteupSelect } from "@/types/database";

interface WriteupChecklistProps {
  lessons: LessonSelect[];
  writeups: WriteupSelect[];
}

type ChecklistItem = {
  type: string;
  isComplete: boolean;
};

export default function WriteupChecklist({
  lessons,
  writeups,
}: WriteupChecklistProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getChecklistItems = (
    lessonItems: LessonSelect[],
    writeupItems: WriteupSelect[]
  ): ChecklistItem[] => {
    const uniqueTypes = new Set(lessonItems.map((lesson) => lesson.lessonType));
    const writeupTypes = new Set(writeupItems.map((writeup) => writeup.writeupType));

    return Array.from(uniqueTypes).map((lessonType) => ({
      type: lessonType,
      isComplete: writeupTypes.has(lessonType),
    }));
  };

  const isComplete = useMemo(() => {
    const uniqueTypes = new Set(lessons.map((lesson) => lesson.lessonType));
    const writeupTypes = new Set(writeups.map((writeup) => writeup.writeupType));
    return Array.from(uniqueTypes).every((type) => writeupTypes.has(type));
  }, [lessons, writeups]);

  useEffect(() => {
    const sp = new URLSearchParams(searchParams?.toString());
    const value = isComplete ? "complete" : "incomplete";
    if (sp.get("checklist") !== value) {
      sp.set("checklist", value);
      router.replace(`${pathname}?${sp.toString()}`);
    }
  }, [isComplete, pathname, router, searchParams]);

  return (
    <Card className="w-full border border-zinc-200 bg-white/80 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <CardHeader className="px-4 py-3">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Writeup Checklist
        </h2>
      </CardHeader>
      <CardBody className="px-4 pb-4 pt-0">
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {getChecklistItems(lessons, writeups).map((item) => (
            <li
              key={item.type}
              className="flex items-center justify-between py-3"
            >
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
              <Chip
                size="sm"
                radius="sm"
                variant="flat"
                color={item.isComplete ? "success" : "warning"}
                className="text-xs"
              >
                {item.isComplete ? "Complete" : "Incomplete"}
              </Chip>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

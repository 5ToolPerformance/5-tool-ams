"use client";

import { Chip } from "@heroui/react";
import { HeartPulse } from "lucide-react";

import { LessonFatigueData } from "@/db/queries/lessons/lessonQueries.types";

import { LessonViewerSection } from "./LessonViewerSection";

interface Props {
  fatigueData: LessonFatigueData[];
}

function formatReport(report: string) {
  return report.charAt(0).toUpperCase() + report.slice(1);
}

export function FatigueSection({ fatigueData }: Props) {
  if (fatigueData.length === 0) {
    return null;
  }

  return (
    <LessonViewerSection
      title={`Fatigue (${fatigueData.length})`}
      icon={<HeartPulse className="h-4 w-4" />}
    >
      <div className="flex flex-wrap gap-2">
        {fatigueData.map((fatigue) => {
          const segments = [
            formatReport(fatigue.report),
            fatigue.bodyPart,
            typeof fatigue.severity === "number" ? `${fatigue.severity}/10` : null,
          ].filter(Boolean);

          return (
            <Chip
              key={fatigue.id}
              size="md"
              variant="flat"
              classNames={{
                base: "min-h-9 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2",
                content: "text-sm font-medium text-amber-700 dark:text-amber-300",
              }}
            >
              {segments.join(" | ")}
            </Chip>
          );
        })}
      </div>
    </LessonViewerSection>
  );
}

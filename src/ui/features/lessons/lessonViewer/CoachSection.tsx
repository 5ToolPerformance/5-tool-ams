"use client";

import { Avatar } from "@heroui/react";
import { Mail, User } from "lucide-react";

import { LessonCoachData } from "@/db/queries/lessons/lessonQueries.types";

import { getCoachInitials } from "../lessonCard/lessonFormatters";
import { LessonViewerSection } from "./LessonViewerSection";

interface Props {
  coach: LessonCoachData;
}

export function CoachSection({ coach }: Props) {
  return (
    <LessonViewerSection title="Coach" icon={<User className="h-4 w-4" />}>
      <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <Avatar
          src={coach.image ?? undefined}
          name={getCoachInitials(coach)}
          size="lg"
          classNames={{
            base: "ring-2 ring-white dark:ring-zinc-900 flex-shrink-0",
            name: "text-sm font-semibold",
          }}
        />
        <div className="min-w-0 space-y-1">
          <p className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {coach.name ?? "Unknown Coach"}
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{coach.email}</span>
          </div>
        </div>
      </div>
    </LessonViewerSection>
  );
}

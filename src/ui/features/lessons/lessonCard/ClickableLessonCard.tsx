"use client";

import { useRouter } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

import { LessonCard } from "./LessonCard";
import type { ViewContext } from "./types";

interface ClickableLessonCardProps {
  lesson: LessonCardData;
  viewContext: ViewContext;
  /** URL to navigate to when clicked. Defaults to /lessons/[id] */
  href?: string;
  /** Custom click handler. If provided, href is ignored */
  onClick?: (lessonId: string) => void;
  className?: string;
}

export function ClickableLessonCard({
  lesson,
  viewContext,
  href,
  onClick,
  className = "",
}: ClickableLessonCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(lesson.id);
    } else {
      router.push(href ?? `/lessons/${lesson.id}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group w-full rounded-xl text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:hover:shadow-zinc-900/30 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-zinc-950 ${className}`}
    >
      <div className="relative">
        <LessonCard lesson={lesson} viewContext={viewContext} />

        {/* Hover indicator */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 group-hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200">
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </button>
  );
}

export default ClickableLessonCard;

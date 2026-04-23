import type { LessonSummary } from "../shared/lesson-summary";

interface PlayerNoteRow {
  id: string;
  createdAt: string;
  content: string;
  type: string;
  author: {
    id: string;
    name: string;
    role?: string;
  };
}

export function buildRecentActivity(
  lessons: LessonSummary[],
  notes: PlayerNoteRow[]
) {
  const lessonItems = lessons.map((l) => ({
    type: "lesson" as const,
    id: l.id,
    date: l.lessonDate,
    discipline: l.lessonType,
    summary: l.mechanics[0]?.name,
  }));

  const noteItems = notes.map((n) => ({
    type: "note" as const,
    id: n.id,
    date: n.createdAt,
    author: n.author.name,
    preview: n.content.slice(0, 60),
  }));

  return [...lessonItems, ...noteItems]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 6);
}

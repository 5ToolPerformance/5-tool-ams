// ui/features/training/LessonGroup.tsx
import { LessonCard } from "./LessonCard";

interface Lesson {
  id: string;
  type: string;
  coach: string;
  mechanics: string[];
  notes: string;
}

interface LessonGroupProps {
  date: string;
  lessons: Lesson[];
}

export function LessonGroup({ date, lessons }: LessonGroupProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold uppercase text-muted-foreground">
        {date}
      </h3>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}

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
  const getChecklistItems = (
    lessons: LessonSelect[],
    writeups: WriteupSelect[]
  ): ChecklistItem[] => {
    // Get unique lesson types
    const uniqueTypes = new Set(lessons.map((l) => l.lessonType));

    // Get types that have writeups
    const writeupTypes = new Set(writeups.map((w) => w.writeupType));

    // Create checklist items
    return Array.from(uniqueTypes).map((lessonType) => ({
      type: lessonType,
      isComplete: writeupTypes.has(lessonType),
    }));
  };
  return (
    <div>
      <h2>Writeup Checklist</h2>
      <ul>
        {getChecklistItems(lessons, writeups).map((item) => (
          <li key={item.type}>
            {item.type} {item.isComplete ? "Complete" : "Incomplete"}
          </li>
        ))}
      </ul>
    </div>
  );
}

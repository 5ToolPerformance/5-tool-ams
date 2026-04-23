// ui/features/training/LessonTimeline.tsx
import { LessonGroup } from "./LessonGroup";

const fakeLessons = [
  {
    date: "Jan 2026",
    lessons: [
      {
        id: "1",
        type: "Pitching",
        coach: "J. Nappi",
        mechanics: ["Arm path", "Tempo"],
        notes: "Focused on smoothing out arm action.",
      },
      {
        id: "2",
        type: "Strength",
        coach: "Staff",
        mechanics: ["Lower body power"],
        notes: "Explosive movement emphasis.",
      },
    ],
  },
  {
    date: "Dec 2025",
    lessons: [
      {
        id: "3",
        type: "Hitting",
        coach: "J. Nappi",
        mechanics: ["Launch position"],
        notes: "Worked on early barrel positioning.",
      },
    ],
  },
];

export async function LessonTimeline() {
  return (
    <div className="space-y-8">
      {fakeLessons.map((group) => (
        <LessonGroup
          key={group.date}
          date={group.date}
          lessons={group.lessons}
        />
      ))}
    </div>
  );
}

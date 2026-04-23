// ui/features/training/LessonCard.tsx
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

interface LessonCardProps {
  lesson: {
    type: string;
    coach: string;
    mechanics: string[];
    notes: string;
  };
}

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card shadow="sm">
      <CardHeader className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{lesson.type} Lesson</h4>
          <p className="text-xs text-muted-foreground">Coach: {lesson.coach}</p>
        </div>
      </CardHeader>

      <CardBody className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {lesson.mechanics.map((m) => (
            <Chip key={m} size="sm" variant="flat">
              {m}
            </Chip>
          ))}
        </div>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {lesson.notes}
        </p>
      </CardBody>
    </Card>
  );
}

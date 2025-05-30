import { Card, CardBody } from "@heroui/react";

import { LESSON_TYPES } from "@/types/lessons";

export interface LessonData {
  id: string;
  date: string;
  type: string;
  notes: string;
  armCare?: string;
  smfa?: string;
  hawkinsForce?: string;
  totalStrength?: string;
  coach: {
    id: number;
    name: string;
  };
}

interface LessonCardProps {
  lesson: LessonData;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const lessonType = LESSON_TYPES.find((type) => type.value === lesson.type);

  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-semibold">{lessonType?.label}</h3>
              <span className="text-sm text-default-500">
                • {formatDate(lesson.date)}
              </span>
            </div>
            <p className="mb-3 text-sm text-primary">
              with Coach {lesson.coach.name}
            </p>
            <p className="mb-4 text-default-700">{lesson.notes}</p>
            {/*{lesson.skills && lesson.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {lesson.skills.map((skill, index) => (
                  <Chip key={index} size="sm" variant="flat" color="secondary">
                    {skill}
                  </Chip>
                ))}
              </div>
            )}*/}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default LessonCard;

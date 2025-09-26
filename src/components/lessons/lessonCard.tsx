import { Button, Card, CardBody, Chip } from "@heroui/react";

import { DateTimeService } from "@/lib/services/date-time";
import { StringService } from "@/lib/services/strings";

import FormattedText from "../ui/formattedText";

export interface LessonData {
  lesson: {
    id: string;
    userId: string;
    coachId: string;
    lessonType: string;
    notes: string;
    createdOn: string;
    lessonDate: string;
  };
  coach: {
    id: string;
    name: string;
    email: string;
    emailVerified: string | null;
    image: string;
    role: string;
    username: string | null;
  };
}

interface LessonCardProps {
  lesson: LessonData;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                {StringService.formatLessonType(lesson.lesson.lessonType)}
              </h3>
              <span className="text-sm text-default-500">
                • {DateTimeService.formatLessonDate(lesson.lesson.lessonDate)}
              </span>
            </div>

            <FormattedText text={lesson.lesson.notes} isShort />
            <div className="flex flex-wrap gap-2">
              <Chip size="sm" variant="flat" color="secondary">
                {lesson.lesson.lessonType}
              </Chip>
            </div>
            <a href={`/lessons/${lesson.lesson.id}`}>
              <Button size="sm" variant="light">
                View Details
              </Button>
            </a>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default LessonCard;

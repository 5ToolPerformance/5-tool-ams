import { Card, CardBody, Chip } from "@heroui/react";

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
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate a title from the lesson type
  const generateTitle = (type: string) => {
    return `${type.charAt(0).toUpperCase() + type.slice(1)} Training`;
  };

  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                {generateTitle(lesson.lesson.lessonType)}
              </h3>
              <span className="text-sm text-default-500">
                • {formatDate(lesson.lesson.lessonDate)}
              </span>
            </div>
            <p className="mb-3 text-sm text-primary">
              with {lesson.coach.name}
            </p>
            <p className="mb-4 text-default-700">{lesson.lesson.notes}</p>
            <div className="flex flex-wrap gap-2">
              <Chip size="sm" variant="flat" color="secondary">
                {lesson.lesson.lessonType}
              </Chip>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default LessonCard;

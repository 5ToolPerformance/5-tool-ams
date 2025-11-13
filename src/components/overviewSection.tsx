import { Card, CardBody } from "@heroui/react";
import { Target } from "lucide-react";

import { useLessonsByPlayerId, usePlayerDashboardStats } from "@/hooks";

interface OverviewSectionProps {
  playerId: string | null;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ playerId }) => {
  if (!playerId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Player Overview</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-default-500">No player selected</p>
        </div>
      </div>
    );
  }

  const {
    lessons,
    lessonCount,
    isLoading,
    error: lessonsError,
  } = useLessonsByPlayerId(playerId);

  const { totalLessons, lessonsLastMonth, lessonTypes } =
    usePlayerDashboardStats(playerId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Player Overview</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-default-500">Loading overview...</p>
        </div>
      </div>
    );
  }

  if (lessonsError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Player Overview</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-danger">Error loading overview: {lessonsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-default-600">Total Lessons</p>
                <p className="text-xl font-semibold">{totalLessons} Lessons</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-default-600">Lessons Last Month</p>
                <p className="text-xl font-semibold">
                  {lessonsLastMonth} Lessons
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Stats */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lesson Types</h2>
          </div>
          <div className="mt-4">
            <ul>
              {Object.entries(lessonTypes).map(([lessonType, typeCount]) => (
                <li key={lessonType}>
                  {lessonType}: {typeCount || 0}
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default OverviewSection;

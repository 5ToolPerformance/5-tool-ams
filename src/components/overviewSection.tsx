import { Card, CardBody } from "@heroui/react";
import { Target } from "lucide-react";

import { usePlayerDashboardStats } from "@/hooks";

import { LessonTypesPieChart } from "./charts/lessonTypesChart";

interface OverviewSectionProps {
  playerId: string;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ playerId }) => {
  const {
    totalLessons,
    lessonsLastMonth,
    lessonTypes,
    isLoading: statsLoading,
    error: statsError,
  } = usePlayerDashboardStats(playerId);

  if (statsLoading) {
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

  if (statsError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Player Overview</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-danger">Error loading overview: {statsError}</p>
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
                <p className="text-sm text-default-600">
                  Lessons (Last 30 Days)
                </p>
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
          <Card className="w-1/2">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lessons (By Type)</h2>
              </div>
              <div className="mt-4">
                <LessonTypesPieChart lessonTypes={lessonTypes} />
              </div>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
};
export default OverviewSection;

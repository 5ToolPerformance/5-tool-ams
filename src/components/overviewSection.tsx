import { useEffect, useState } from "react";

import { Calendar, Card, CardBody } from "@heroui/react";
import { Target, TrendingUp } from "lucide-react";

import { GrowthChart } from "./charts/growth";

interface OverviewSectionProps {
  playerId: string | number | null;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ playerId }) => {
  const [lessonCount, setLessonCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/players/${playerId}/count`);

        if (!response.ok) {
          throw new Error(`Failed to fetch lessons: ${response.statusText}`);
        }

        const data = await response.json();
        // Extract the lessons array from the response object
        setLessonCount(data.count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchLessons();
    }
  }, [playerId]);

  if (loading) {
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

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Player Overview</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-danger">Error loading overview: {error}</p>
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
                <p className="text-sm text-default-600">This Month</p>
                <p className="text-xl font-semibold">{lessonCount} Sessions</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-default-600">Progress</p>
                <p className="text-xl font-semibold">+15%</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-default-600">Next Session</p>
                <p className="text-xl font-semibold">Tomorrow</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardBody className="p-6">
          <div className="md:w-full lg:w-1/2">
            <GrowthChart />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default OverviewSection;

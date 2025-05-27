import { Calendar, Card, CardBody } from "@heroui/react";
import { Target, TrendingUp } from "lucide-react";

const OverviewSection: React.FC = () => {
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
                <p className="text-xl font-semibold">12 Sessions</p>
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
          <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-content2 p-3">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="flex-1">
                <p className="font-medium">
                  Completed batting practice session
                </p>
                <p className="text-sm text-default-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-content2 p-3">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <div className="flex-1">
                <p className="font-medium">New lesson note added</p>
                <p className="text-sm text-default-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-content2 p-3">
              <div className="h-2 w-2 rounded-full bg-warning"></div>
              <div className="flex-1">
                <p className="font-medium">Workout plan updated</p>
                <p className="text-sm text-default-600">3 days ago</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default OverviewSection;

import { Calendar, Card, CardBody } from "@heroui/react";
import { Target, TrendingUp } from "lucide-react";

import { GrowthChart } from "./charts/growth";

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
          <div className="md:w-full lg:w-1/2">
            <GrowthChart />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default OverviewSection;

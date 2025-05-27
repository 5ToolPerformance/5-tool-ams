import { Card, CardBody, Chip } from "@heroui/react";

const PlansSection: React.FC = () => {
  const plans = [
    {
      id: 1,
      title: "Strength & Conditioning - Week 3",
      type: "Workout Plan",
      assignedBy: "Coach Davis",
      dueDate: "2024-05-30",
      status: "In Progress",
      exercises: [
        { name: "Squats", sets: "3x12", completed: true },
        { name: "Medicine Ball Throws", sets: "4x8", completed: true },
        { name: "Rotational Core Work", sets: "3x15", completed: false },
        { name: "Band Exercises", sets: "2x20", completed: false },
      ],
    },
    {
      id: 2,
      title: "Batting Practice Routine",
      type: "Practice Plan",
      assignedBy: "Coach Martinez",
      dueDate: "2024-05-28",
      status: "Completed",
      exercises: [
        { name: "Tee Work", sets: "50 swings", completed: true },
        { name: "Soft Toss", sets: "3 rounds", completed: true },
        { name: "Live Pitching", sets: "2 rounds", completed: true },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Training Plans</h2>
        <p className="text-sm text-default-600">{plans.length} active plans</p>
      </div>

      {plans.map((plan) => (
        <Card key={plan.id}>
          <CardBody className="p-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{plan.title}</h3>
                <p className="text-sm text-default-600">
                  {plan.type} • Assigned by {plan.assignedBy}
                </p>
                <p className="text-sm text-default-500">Due: {plan.dueDate}</p>
              </div>
              <Chip
                color={plan.status === "Completed" ? "success" : "primary"}
                variant="flat"
                size="sm"
              >
                {plan.status}
              </Chip>
            </div>

            <div className="space-y-2">
              <p className="mb-3 text-sm font-medium text-default-700">
                Exercises:
              </p>
              {plan.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg bg-content2 p-2"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${exercise.completed ? "bg-success" : "bg-default-300"}`}
                  ></div>
                  <div className="flex-1">
                    <span
                      className={
                        exercise.completed
                          ? "text-default-500 line-through"
                          : "text-default-700"
                      }
                    >
                      {exercise.name}
                    </span>
                    <span className="ml-2 text-sm text-default-500">
                      ({exercise.sets})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
export default PlansSection;

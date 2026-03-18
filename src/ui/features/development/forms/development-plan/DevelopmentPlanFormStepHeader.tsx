"use client";

type DevelopmentPlanFormStepHeaderProps = {
  stepIndex: number;
  totalSteps: number;
  title: string;
  mode: "create" | "edit";
};

export function DevelopmentPlanFormStepHeader({
  stepIndex,
  totalSteps,
  title,
  mode,
}: DevelopmentPlanFormStepHeaderProps) {
  return (
    <div className="border-b px-6 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-default-500">
        {mode === "edit" ? "Edit Development Plan" : "New Development Plan"}
      </p>
      <div className="mt-1 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-default-500">
            Step {stepIndex + 1} of {totalSteps}
          </p>
        </div>
        <div className="flex min-w-32 gap-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= stepIndex ? "bg-primary" : "bg-default-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

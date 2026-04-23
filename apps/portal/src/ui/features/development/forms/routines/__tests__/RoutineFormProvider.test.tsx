import { fireEvent, render, screen } from "@testing-library/react";

import { RoutineFormProvider, useRoutineFormContext } from "@/ui/features/development/forms/routines/RoutineFormProvider";

function TestConsumer() {
  const { availableMechanicOptions, availableDrillOptions, appendDrillOption } =
    useRoutineFormContext();

  return (
    <div>
      <span>{`mechanics:${availableMechanicOptions.map((item) => item.id).join(",")}`}</span>
      <span>{`drills:${availableDrillOptions.map((item) => item.id).join(",")}`}</span>
      <button
        type="button"
        onClick={() =>
          appendDrillOption({
            id: "drill-3",
            title: "New pitching drill",
            description: "",
            discipline: "pitching",
            tags: [],
          })
        }
      >
        append drill
      </button>
    </div>
  );
}

describe("RoutineFormProvider", () => {
  const baseProps = {
    mode: "create" as const,
    createdBy: "coach-1",
    initialPlayerId: "player-1",
    initialDisciplineId: "disc-1",
    disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
    developmentPlanOptions: [
      {
        id: "plan-1",
        playerId: "player-1",
        disciplineId: "disc-1",
        disciplineKey: "pitching",
        disciplineLabel: "Pitching",
        status: "active" as const,
        title: "Pitching plan",
      },
    ],
    mechanicOptions: [
      {
        id: "mech-1",
        name: "Pitching mechanic",
        description: null,
        type: "pitching" as const,
        tags: [],
      },
      {
        id: "mech-2",
        name: "Hitting mechanic",
        description: null,
        type: "hitting" as const,
        tags: [],
      },
    ],
    drillOptions: [
      {
        id: "drill-1",
        title: "Pitching drill",
        description: "",
        discipline: "pitching" as const,
        tags: [],
      },
      {
        id: "drill-2",
        title: "Hitting drill",
        description: "",
        discipline: "hitting" as const,
        tags: [],
      },
    ],
  };

  it("filters mechanic and drill options to the selected plan discipline", () => {
    render(
      <RoutineFormProvider {...baseProps} initialDevelopmentPlanId="plan-1">
        <TestConsumer />
      </RoutineFormProvider>
    );

    expect(screen.getByText("mechanics:mech-1")).toBeTruthy();
    expect(screen.getByText("drills:drill-1")).toBeTruthy();
  });

  it("falls back to all mechanics for arm care plans", () => {
    render(
      <RoutineFormProvider
        {...baseProps}
        initialDevelopmentPlanId="plan-2"
        developmentPlanOptions={[
          ...baseProps.developmentPlanOptions,
          {
            id: "plan-2",
            playerId: "player-1",
            disciplineId: "disc-2",
            disciplineKey: "arm_care",
            disciplineLabel: "Arm Care",
            status: "active",
            title: "Arm care plan",
          },
        ]}
      >
        <TestConsumer />
      </RoutineFormProvider>
    );

    expect(screen.getByText("mechanics:mech-1,mech-2")).toBeTruthy();
  });

  it("appends newly created drills into the filtered drill options", () => {
    render(
      <RoutineFormProvider {...baseProps} initialDevelopmentPlanId="plan-1">
        <TestConsumer />
      </RoutineFormProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "append drill" }));

    expect(screen.getByText("drills:drill-1,drill-3")).toBeTruthy();
  });

  it("filters options by the selected discipline when no plan is linked", () => {
    render(
      <RoutineFormProvider {...baseProps}>
        <TestConsumer />
      </RoutineFormProvider>
    );

    expect(screen.getByText("mechanics:mech-1")).toBeTruthy();
    expect(screen.getByText("drills:drill-1")).toBeTruthy();
  });

  it("uses the chosen standalone discipline until a plan is selected", () => {
    render(
      <RoutineFormProvider
        {...baseProps}
        initialDisciplineId="disc-1"
        disciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
          { id: "disc-2", key: "hitting", label: "Hitting" },
        ]}
      >
        <TestConsumer />
      </RoutineFormProvider>
    );

    expect(screen.getByText("mechanics:mech-1")).toBeTruthy();
  });
});



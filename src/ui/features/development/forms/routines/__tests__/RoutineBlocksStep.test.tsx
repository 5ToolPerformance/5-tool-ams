import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { RoutineBasicInfoStep } from "@/ui/features/development/forms/routines/RoutineBasicInfoStep";
import { RoutineBlocksStep } from "@/ui/features/development/forms/routines/RoutineBlocksStep";

jest.mock("@heroui/react", () => {
  const actual = jest.requireActual("@heroui/react");

  return {
    ...actual,
    Button: ({ children, onPress, onClick, ...props }: any) => (
      <button type="button" onClick={onPress ?? onClick} {...props}>
        {children}
      </button>
    ),
  };
});

const mockContext = {
  mode: "create",
  contextType: "development-plan",
  developmentPlanOptions: [],
  disciplineOptions: [],
  selectedDevelopmentPlan: null,
  selectedDiscipline: { id: "disc-1", key: "pitching", label: "Pitching" },
  isDevelopmentPlanSelectionLocked: false,
  mechanicOptions: [],
  drillOptions: [],
  availableMechanicOptions: [],
  availableDrillOptions: [
    {
      id: "drill-1",
      title: "Stride timing drill",
      description: "desc",
      discipline: "pitching",
      tags: [],
    },
  ],
  values: {
    developmentPlanId: "plan-1",
    disciplineId: "disc-1",
    title: "Routine",
    description: "desc",
    routineType: "partial_lesson",
    sortOrder: 0,
    isActive: true,
    summary: "",
    usageNotes: "",
    mechanics: [],
    blocks: [
      {
        id: "block-1",
        title: "Block 1",
        notes: "",
        sortOrder: 0,
        drills: [
          {
            id: "drill-row-1",
            drillId: "drill-1",
            title: "Stride timing drill",
            notes: "",
            sortOrder: 0,
          },
        ],
      },
    ],
  },
  errors: {},
  isSubmitting: false,
  submitAction: null,
  setFieldValue: jest.fn(),
  addMechanic: jest.fn(),
  updateMechanic: jest.fn(),
  removeMechanic: jest.fn(),
  addBlock: jest.fn(),
  updateBlock: jest.fn(),
  reorderBlocks: jest.fn(),
  removeBlock: jest.fn(),
  addDrillToBlock: jest.fn(),
  updateDrillInBlock: jest.fn(),
  reorderDrillsInBlock: jest.fn(),
  removeDrillFromBlock: jest.fn(),
  handleSubmit: jest.fn(),
  resetForm: jest.fn(),
};

jest.mock(
  "@/ui/features/development/forms/routines/RoutineFormProvider",
  () => ({
    useRoutineFormContext: () => mockContext,
  })
);

describe("routine form step UX", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render a visible routine sort order field", () => {
    render(<RoutineBasicInfoStep />);

    expect(screen.queryByLabelText("Sort Order")).toBeNull();
  });

  it("hides block and drill notes by default and reveals them via add note buttons", () => {
    render(<RoutineBlocksStep />);

    expect(screen.queryByLabelText("Block Sort Order")).toBeNull();
    expect(screen.queryByLabelText("Drill Sort Order")).toBeNull();
    expect(screen.queryByLabelText("Block Note")).toBeNull();
    expect(screen.queryByLabelText("Drill Note")).toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: "Add note" })[0]);
    expect(screen.getByLabelText("Block Note")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", { name: "Add note" })[0]);
    expect(screen.getByLabelText("Drill Note")).toBeTruthy();
  });
});

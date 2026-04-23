import React, { type ReactNode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { RoutineBasicInfoStep } from "@/ui/features/development/forms/routines/RoutineBasicInfoStep";
import { RoutineBlocksStep } from "@/ui/features/development/forms/routines/RoutineBlocksStep";
import type { Drill } from "@/ui/features/drills/types";

jest.mock("@heroui/react", () => {
  const actual = jest.requireActual("@heroui/react");

  return {
    ...actual,
    Button: ({
      children,
      onPress,
      onClick,
      isDisabled,
      startContent: _startContent,
      color: _color,
      variant: _variant,
      ...props
    }: any) => (
      <button type="button" onClick={onPress ?? onClick} disabled={isDisabled} {...props}>
        {children}
      </button>
    ),
    Checkbox: ({ children, isSelected, onValueChange }: any) => (
      <label>
        <input
          type="checkbox"
          checked={Boolean(isSelected)}
          onChange={(event) => onValueChange?.(event.target.checked)}
        />
        {children}
      </label>
    ),
    Input: ({
      label,
      "aria-label": ariaLabel,
      value,
      onValueChange,
      startContent,
      labelPlacement: _labelPlacement,
      isInvalid: _isInvalid,
      errorMessage: _errorMessage,
      isReadOnly: _isReadOnly,
      ...props
    }: any) => (
      <label>
        <span>{label ?? ariaLabel}</span>
        {startContent}
        <input
          aria-label={label ?? ariaLabel}
          value={value ?? ""}
          onChange={(event) => onValueChange?.(event.target.value)}
          {...props}
        />
      </label>
    ),
    Select: ({
      children,
      selectedKeys,
      onSelectionChange,
      "aria-label": ariaLabel,
      ...props
    }: any) => {
      const selected = Array.from(selectedKeys ?? [])[0] ?? "";

      return (
        <label>
          <span>{ariaLabel}</span>
          <select
            aria-label={ariaLabel}
            value={String(selected)}
            onChange={(event) =>
              onSelectionChange?.(new Set(event.target.value ? [event.target.value] : []))
            }
            {...props}
          >
            {children}
          </select>
        </label>
      );
    },
    SelectItem: ({ children, value, id, itemKey }: any) => (
      <option value={value ?? itemKey ?? id ?? String(children)}>{children}</option>
    ),
    Textarea: ({
      label,
      value,
      onValueChange,
      labelPlacement: _labelPlacement,
      minRows: _minRows,
      classNames: _classNames,
      ...props
    }: any) => (
      <label>
        <span>{label}</span>
        <textarea
          aria-label={label}
          value={value ?? ""}
          onChange={(event) => onValueChange?.(event.target.value)}
          {...props}
        />
      </label>
    ),
    Modal: ({ children, isOpen }: { children: ReactNode; isOpen: boolean }) =>
      isOpen ? <div data-testid="modal-root">{children}</div> : null,
    ModalContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    ModalHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    ModalBody: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    ModalFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Chip: ({ children }: { children: ReactNode }) => <span>{children}</span>,
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
      id: "drill-2",
      title: "Balance drill",
      description: "Balance work",
      discipline: "pitching",
      tags: ["lower-half"],
    },
    {
      id: "drill-3",
      title: "Fielding footwork",
      description: "Fielding work",
      discipline: "fielding",
      tags: ["glove"],
    },
    {
      id: "drill-1",
      title: "Stride timing drill",
      description: "Timing work",
      discipline: "pitching",
      tags: ["tempo"],
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
  addDrillsToBlock: jest.fn(),
  appendDrillOption: jest.fn(),
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

jest.mock("@/ui/features/drills/DrillForm", () => ({
  DrillForm: ({
    onSaved,
    onCancel,
    initialDiscipline,
  }: {
    onSaved?: (drill: Drill) => void | Promise<void>;
    onCancel?: () => void;
    initialDiscipline?: string;
  }) => (
    <div>
      <div>{`mock-drill-form:${initialDiscipline ?? "none"}`}</div>
      <button
        type="button"
        onClick={() =>
          onSaved?.({
            id: "drill-new",
            title: "New drill",
            description: "Created from modal",
            discipline: "pitching",
            videoProvider: null,
            videoId: null,
            videoUrl: null,
            createdBy: { id: "coach-1", name: "Coach" },
            createdOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
            tags: ["new-tag"],
            media: [],
          })
        }
      >
        Save mock drill
      </button>
      <button type="button" onClick={onCancel}>
        Cancel mock drill
      </button>
    </div>
  ),
}));

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

  it("opens the drill picker modal and keeps the default discipline filter while excluding duplicates", () => {
    render(<RoutineBlocksStep />);

    fireEvent.click(screen.getByRole("button", { name: "Add Drills" }));

    expect(screen.queryByText("Fielding footwork")).toBeNull();

    const modal = screen.getByTestId("modal-root");
    const checkboxes = within(modal).getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(1);

    expect(within(modal).getByText("Balance drill")).toBeTruthy();
    expect(screen.queryAllByText("Stride timing drill")).toHaveLength(1);
  });

  it("filters drill options by search and discipline and submits selected drills", () => {
    render(<RoutineBlocksStep />);

    fireEvent.click(screen.getByRole("button", { name: "Add Drills" }));

    fireEvent.change(screen.getByLabelText("Filter by discipline"), {
      target: { value: "all" },
    });
    fireEvent.change(screen.getByLabelText("Search drills"), {
      target: { value: "fielding" },
    });
    expect(screen.getByText("Fielding footwork")).toBeTruthy();
    expect(screen.queryByText("Balance drill")).toBeNull();

    fireEvent.change(screen.getByLabelText("Search drills"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Filter by discipline"), {
      target: { value: "pitching" },
    });

    const modal = screen.getByTestId("modal-root");
    const modalQueries = within(modal);
    const modalCheckboxes = modalQueries.getAllByRole("checkbox");

    fireEvent.click(modalCheckboxes[0]);
    fireEvent.click(modalQueries.getByRole("button", { name: "Add" }));

    expect(mockContext.addDrillsToBlock).toHaveBeenCalledWith(0, ["drill-2"]);
  });

  it("creates a drill in the picker, refreshes the selection view, and keeps it selected until add", () => {
    render(<RoutineBlocksStep />);

    fireEvent.click(screen.getByRole("button", { name: "Add Drills" }));
    fireEvent.click(screen.getByRole("button", { name: "Create Drill" }));

    expect(screen.getByText("mock-drill-form:pitching")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Save mock drill" }));

    expect(mockContext.appendDrillOption).toHaveBeenCalledWith({
      id: "drill-new",
      title: "New drill",
      description: "Created from modal",
      discipline: "pitching",
      tags: ["new-tag"],
    });
    expect(screen.getByText("1 selected | 1 already in this block")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(mockContext.addDrillsToBlock).toHaveBeenCalledWith(0, ["drill-new"]);
  });
});

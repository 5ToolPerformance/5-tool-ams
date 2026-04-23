import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { RoutineViewModal } from "@/ui/features/routines/RoutineViewModal";

jest.mock("@heroui/react", () => {
  const actual = jest.requireActual("@heroui/react");

  return {
    ...actual,
    Button: ({ children, onPress, onClick, ...props }: any) => (
      <button type="button" onClick={onPress ?? onClick} {...props}>
        {children}
      </button>
    ),
    Modal: ({ children, isOpen }: any) => (isOpen ? <div role="dialog">{children}</div> : null),
    ModalContent: ({ children }: any) => <div>{children}</div>,
    ModalHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    ModalBody: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    ModalFooter: ({ children }: any) => <div>{children}</div>,
    Card: ({ children }: any) => <div>{children}</div>,
    CardBody: ({ children, className }: any) => <div className={className}>{children}</div>,
    Chip: ({ children }: any) => <span>{children}</span>,
  };
});

describe("RoutineViewModal", () => {
  const baseRoutine = {
    id: "routine-1",
    title: "Recovery Routine",
    description: "Keep the arm moving",
    routineType: "partial_lesson",
    sourceLabel: "Universal Routine",
    disciplineLabel: "Pitching",
    documentData: {
      overview: {
        summary: "Reset the arm after work",
        usageNotes: "Use after heavier throwing days",
      },
      mechanics: [{ mechanicId: "mechanic-1", title: "Arm path" }],
      blocks: [
        {
          id: "block-1",
          title: "Reset",
          notes: "Move with control",
          drills: [
            {
              drillId: "drill-1",
              title: "Band series",
              notes: "Keep tension even",
            },
          ],
        },
      ],
    },
  };

  it("renders summary, usage notes, mechanics, and block details", () => {
    render(<RoutineViewModal isOpen onClose={jest.fn()} routine={baseRoutine} />);

    expect(screen.getByText("Reset the arm after work")).toBeTruthy();
    expect(screen.getByText("Use after heavier throwing days")).toBeTruthy();
    expect(screen.getByText("Arm path")).toBeTruthy();
    expect(screen.getByText("Reset")).toBeTruthy();
    expect(screen.getByText("Band series")).toBeTruthy();
    expect(screen.getByText("Keep tension even")).toBeTruthy();
  });

  it("shows empty states for routines without mechanics or blocks", () => {
    render(
      <RoutineViewModal
        isOpen
        onClose={jest.fn()}
        routine={{
          ...baseRoutine,
          documentData: {
            overview: {},
            mechanics: [],
            blocks: [],
          },
        }}
      />
    );

    expect(screen.getByText("No mechanics are attached to this routine.")).toBeTruthy();
    expect(screen.getByText("No blocks are attached to this routine.")).toBeTruthy();
  });

  it("handles malformed document data gracefully", () => {
    render(
      <RoutineViewModal
        isOpen
        onClose={jest.fn()}
        routine={{
          ...baseRoutine,
          documentData: "invalid-routine-document",
        }}
      />
    );

    expect(screen.getByText("No mechanics are attached to this routine.")).toBeTruthy();
    expect(screen.getByText("No blocks are attached to this routine.")).toBeTruthy();
  });

  it("shows a local error when a routine drill does not have a drill id", () => {
    render(
      <RoutineViewModal
        isOpen
        onClose={jest.fn()}
        routine={{
          ...baseRoutine,
          documentData: {
            overview: {},
            mechanics: [],
            blocks: [
              {
                id: "block-1",
                title: "Reset",
                drills: [{ title: "Legacy drill" }],
              },
            ],
          },
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "View Drill" }));

    expect(
      screen.getByText("More drill details are unavailable for Legacy drill.")
    ).toBeTruthy();
  });
});

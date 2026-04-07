import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { RoutinesPanel } from "@/ui/features/athlete-development/RoutinesPanel";

const originalFetch = global.fetch;

jest.mock("@heroui/react", () => {
  const actual = jest.requireActual("@heroui/react");

  return {
    ...actual,
    Button: ({
      children,
      onPress,
      onClick,
      isDisabled,
      isLoading,
      ...props
    }: any) => (
      <button
        type="button"
        onClick={onPress ?? onClick}
        disabled={Boolean(isDisabled || isLoading)}
        {...props}
      >
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
    Input: ({ value, onValueChange, startContent, ...props }: any) => (
      <input
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        {...props}
      />
    ),
  };
});

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/ui/core/athletes/SectionShell", () => ({
  SectionShell: ({ title, description, children }: any) => (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  ),
}));

describe("RoutinesPanel", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  const playerRoutine = {
    id: "player-routine-1",
    title: "Player Routine",
    description: "Player routine description",
    routineType: "partial_lesson",
    isActive: true,
    documentData: {
      overview: {
        summary: "Routine summary",
        usageNotes: "Routine usage notes",
      },
      mechanics: [{ mechanicId: "mechanic-1", title: "Stride timing" }],
      blocks: [
        {
          id: "block-1",
          title: "Warm Up",
          notes: "Start light",
          drills: [
            {
              drillId: "drill-1",
              title: "Pivot pickoff",
              notes: "Stay athletic",
            },
          ],
        },
      ],
    },
  };

  const universalRoutine = {
    id: "universal-routine-1",
    createdByName: "Coach One",
    title: "Universal Routine",
    description: "Universal routine description",
    routineType: "full_lesson",
    isActive: true,
    documentData: {
      overview: { summary: "Universal summary" },
      mechanics: [],
      blocks: [],
    },
  };

  it("opens the player routine modal with mechanics, blocks, and notes", async () => {
    render(
      <RoutinesPanel
        playerRoutines={[playerRoutine as any]}
        universalRoutines={[]}
        universalRoutinesSupported
        activePlanId="plan-1"
        disciplineKey="pitching"
        disciplineLabel="Pitching"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "View Routine" }));

    const dialogs = await screen.findAllByRole("dialog");
    const modal = dialogs[dialogs.length - 1];

    expect(within(modal).getByText("Usage Notes")).toBeTruthy();
    expect(within(modal).getByText("Routine usage notes")).toBeTruthy();
    expect(within(modal).getByText("Stride timing")).toBeTruthy();
    expect(within(modal).getByText("Warm Up")).toBeTruthy();
    expect(within(modal).getByText("Start light")).toBeTruthy();
    expect(within(modal).getByText("Pivot pickoff")).toBeTruthy();
    expect(within(modal).getByText("Stay athletic")).toBeTruthy();
  });

  it("opens drill details from the routine modal", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        drill: {
          id: "drill-1",
          title: "Pivot pickoff",
          description: "Full drill details",
          discipline: "pitching",
          videoProvider: "youtube",
          videoId: "abc123",
          videoUrl: "https://youtube.com/watch?v=abc123",
          createdBy: { id: "coach-1", name: "Coach One" },
          createdOn: "2026-01-01T00:00:00.000Z",
          updatedOn: "2026-01-01T00:00:00.000Z",
          tags: ["footwork"],
          media: [],
        },
      }),
    });

    render(
      <RoutinesPanel
        playerRoutines={[playerRoutine as any]}
        universalRoutines={[]}
        universalRoutinesSupported
        activePlanId="plan-1"
        disciplineKey="pitching"
        disciplineLabel="Pitching"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "View Routine" }));
    fireEvent.click(await screen.findByRole("button", { name: "View Drill" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/drills/drill-1");
    });

    const dialogs = await screen.findAllByRole("dialog");
    const drillModal = dialogs[dialogs.length - 1];

    expect(within(drillModal).getByText("Drill Details")).toBeTruthy();
    expect(within(drillModal).getByText("Full drill details")).toBeTruthy();
  });

  it("keeps the routine modal open when drill loading fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Drill not found." }),
    });

    render(
      <RoutinesPanel
        playerRoutines={[playerRoutine as any]}
        universalRoutines={[]}
        universalRoutinesSupported
        activePlanId="plan-1"
        disciplineKey="pitching"
        disciplineLabel="Pitching"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "View Routine" }));
    fireEvent.click(await screen.findByRole("button", { name: "View Drill" }));

    await screen.findByText("Drill not found.");
    const dialogs = await screen.findAllByRole("dialog");
    const modal = dialogs[0];

    expect(within(modal).getByText("Drill not found.")).toBeTruthy();
    expect(within(modal).getByText("Warm Up")).toBeTruthy();
  });

  it("opens universal routines from the panel without affecting assignment actions", async () => {
    render(
      <RoutinesPanel
        playerRoutines={[]}
        universalRoutines={[universalRoutine as any]}
        universalRoutinesSupported
        activePlanId="plan-1"
        disciplineKey="pitching"
        disciplineLabel="Pitching"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "View Routine" }));

    const dialogs = await screen.findAllByRole("dialog");
    const modal = dialogs[dialogs.length - 1];

    expect(within(modal).getByText("Universal summary")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Assign to Plan" })).toBeTruthy();
  });
});

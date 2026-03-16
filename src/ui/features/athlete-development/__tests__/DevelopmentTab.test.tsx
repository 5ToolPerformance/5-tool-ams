import type { ReactNode } from "react";

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import { DevelopmentTab } from "@/ui/features/athlete-development/DevelopmentTab";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  usePathname: () => "/players/player-1/development",
  useSearchParams: () => new URLSearchParams("discipline=disc-1"),
}));

jest.mock("@/ui/core/RightSideDrawer", () => ({
  RightSideDrawer: ({
    isOpen,
    onClose,
    title,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
  }) =>
    isOpen ? (
      <div aria-label={title} role="dialog">
        <h2>{title}</h2>
        <button aria-label="Close drawer" onClick={onClose} type="button">
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

jest.mock(
  "@/ui/features/development/forms/evaluation/EvaluationFormProvider",
  () => ({
    EvaluationFormProvider: ({ children }: { children: ReactNode }) => children,
  })
);

jest.mock("@/ui/features/development/forms/evaluation/EvaluationForm", () => ({
  EvaluationForm: ({ onCancel }: { onCancel?: () => void }) => (
    <div aria-label="evaluation-form">
      <h3>Basic Information</h3>
      <button onClick={onCancel} type="button">
        Cancel
      </button>
    </div>
  ),
}));

const baseData = {
  selectedDiscipline: { id: "disc-1", key: "pitching", label: "Pitching" },
  disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
  latestEvaluation: {
    id: "eval-1",
    disciplineId: "disc-1",
    evaluationDate: new Date("2026-01-01"),
    evaluationType: "monthly",
    phase: "preseason",
    snapshotSummary: "Snapshot",
    strengthProfileSummary: "Strength",
    keyConstraintsSummary: "Constraint",
    documentData: null,
  },
  evaluationHistory: [],
  activePlan: {
    id: "plan-1",
    status: "active",
    startDate: new Date("2026-01-01"),
    targetEndDate: new Date("2026-02-01"),
    documentData: null,
  },
  developmentPlanHistory: [],
  playerRoutines: [],
  universalRoutines: [],
  universalRoutinesSupported: false,
  flags: {
    hasAnyDisciplineData: true,
    hasEvaluations: true,
    hasActivePlan: true,
    hasRoutines: false,
  },
} as any;

describe("DevelopmentTab", () => {
  it("renders expected sections for populated state", () => {
    render(
      <DevelopmentTab playerId="player-1" createdBy="coach-1" data={baseData} />
    );
    const actionGroup = screen.getByRole("group", {
      name: "Development tab actions",
    });

    expect(screen.getByText("Development")).toBeTruthy();
    expect(screen.getByText("Current Snapshot")).toBeTruthy();
    expect(screen.getByText("Active Plan")).toBeTruthy();
    expect(screen.getByText("Routines")).toBeTruthy();
    expect(screen.getByText("History")).toBeTruthy();
    expect(
      (
        within(actionGroup).getByRole("button", {
          name: "New Evaluation",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false);
    expect(
      (
        within(actionGroup).getByRole("button", {
          name: "New Development Plan",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false);
    expect(
      (
        within(actionGroup).getByRole("button", {
          name: "New Routine",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false);
  });

  it("renders empty state when no discipline data exists", () => {
    render(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        data={{
          ...baseData,
          selectedDiscipline: null,
          disciplineOptions: [],
          flags: { ...baseData.flags, hasAnyDisciplineData: false },
        }}
      />
    );
    const actionGroup = screen.getByRole("group", {
      name: "Development tab actions",
    });

    expect(
      screen.getByText(
        "No development data exists yet for this athlete. Add an evaluation to begin the development workflow."
      )
    ).toBeTruthy();
    expect(
      (
        within(actionGroup).getByRole("button", {
          name: "New Evaluation",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false);
  });

  it("opens and closes the drawer for each development action", async () => {
    render(
      <DevelopmentTab playerId="player-1" createdBy="coach-1" data={baseData} />
    );
    const actionGroup = screen.getByRole("group", {
      name: "Development tab actions",
    });

    fireEvent.click(
      within(actionGroup).getByRole("button", { name: "New Evaluation" })
    );
    expect(
      await screen.findByRole("heading", { name: "New Evaluation" })
    ).toBeTruthy();
    expect(screen.getByLabelText("evaluation-form")).toBeTruthy();
    expect(screen.getByText("Basic Information")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close drawer" }));
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "New Evaluation" })
      ).toBeNull();
    });

    fireEvent.click(
      within(actionGroup).getByRole("button", { name: "New Development Plan" })
    );
    expect(
      await screen.findByRole("heading", { name: "New Development Plan" })
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close drawer" }));
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "New Development Plan" })
      ).toBeNull();
    });

    fireEvent.click(
      within(actionGroup).getByRole("button", { name: "New Routine" })
    );
    expect(
      await screen.findByRole("heading", { name: "New Routine" })
    ).toBeTruthy();
  });
});

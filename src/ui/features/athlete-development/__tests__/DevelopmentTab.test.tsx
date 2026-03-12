import { render, screen } from "@testing-library/react";

import { DevelopmentTab } from "@/ui/features/athlete-development/DevelopmentTab";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/players/player-1/development",
  useSearchParams: () => new URLSearchParams("discipline=disc-1"),
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
    render(<DevelopmentTab data={baseData} />);

    expect(screen.getByText("Development")).toBeTruthy();
    expect(screen.getByText("Current Snapshot")).toBeTruthy();
    expect(screen.getByText("Active Plan")).toBeTruthy();
    expect(screen.getByText("Routines")).toBeTruthy();
    expect(screen.getByText("History")).toBeTruthy();
  });

  it("renders empty state when no discipline data exists", () => {
    render(
      <DevelopmentTab
        data={{
          ...baseData,
          selectedDiscipline: null,
          disciplineOptions: [],
          flags: { ...baseData.flags, hasAnyDisciplineData: false },
        }}
      />
    );

    expect(
      screen.getByText(
        "No development data exists yet for this athlete. Add an evaluation to begin the development workflow."
      )
    ).toBeTruthy();
  });
});

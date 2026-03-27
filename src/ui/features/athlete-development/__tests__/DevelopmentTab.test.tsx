import type { ReactNode } from "react";

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import { DevelopmentTab } from "@/ui/features/athlete-development/DevelopmentTab";
import type { RoutineFormConfig } from "@/application/routines/getRoutineFormConfig";

const refresh = jest.fn();
const push = jest.fn();
const open = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
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
    EvaluationFormProvider: ({
      children,
      onSavedAndContinue,
    }: {
      children: ReactNode;
      onSavedAndContinue?: (evaluationId: string) => void;
    }) => (
      <div>
        {children}
        <button onClick={() => onSavedAndContinue?.("eval-from-save")} type="button">
          Trigger evaluation continue
        </button>
      </div>
    ),
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

jest.mock(
  "@/ui/features/development/forms/development-plan/DevelopmentPlanFormProvider",
  () => ({
    DevelopmentPlanFormProvider: ({
      children,
      evaluationOptions,
      initialEvaluationId,
      isEvaluationSelectionLocked,
      onSavedAndContinue,
    }: {
      children: ReactNode;
      evaluationOptions?: Array<{ id: string }>;
      initialEvaluationId?: string;
      isEvaluationSelectionLocked?: boolean;
      onSavedAndContinue?: (developmentPlanId: string) => void;
    }) => (
      <div>
        <div aria-label="development-plan-provider-meta">
          <span>{`initial:${initialEvaluationId ?? ""}`}</span>
          <span>{`count:${evaluationOptions?.length ?? 0}`}</span>
          <span>{`locked:${String(Boolean(isEvaluationSelectionLocked))}`}</span>
        </div>
        {children}
        <button onClick={() => onSavedAndContinue?.("plan-1")} type="button">
          Trigger plan continue
        </button>
      </div>
    ),
  })
);

jest.mock(
  "@/ui/features/development/forms/development-plan/DevelopmentPlanForm",
  () => ({
    DevelopmentPlanForm: ({ onCancel }: { onCancel?: () => void }) => (
      <div aria-label="development-plan-form">
        <h3>Plan Basic Information</h3>
        <button onClick={onCancel} type="button">
          Cancel Plan
        </button>
      </div>
    ),
  })
);

jest.mock(
  "@/ui/features/development/forms/routines/RoutineFormProvider",
  () => ({
    RoutineFormProvider: ({
      children,
      developmentPlanOptions,
      initialDevelopmentPlanId,
      isDevelopmentPlanSelectionLocked,
      onSaved,
    }: {
      children: ReactNode;
      developmentPlanOptions?: Array<{ id: string }>;
      initialDevelopmentPlanId?: string;
      isDevelopmentPlanSelectionLocked?: boolean;
      onSaved?: (routineId: string) => void;
    }) => (
      <div>
        <div aria-label="routine-provider-meta">
          <span>{`initial-plan:${initialDevelopmentPlanId ?? ""}`}</span>
          <span>{`plan-count:${developmentPlanOptions?.length ?? 0}`}</span>
          <span>{`plan-locked:${String(
            Boolean(isDevelopmentPlanSelectionLocked)
          )}`}</span>
        </div>
        {children}
        <button onClick={() => onSaved?.("routine-1")} type="button">
          Trigger routine save
        </button>
      </div>
    ),
  })
);

jest.mock("@/ui/features/development/forms/routines/RoutineForm", () => ({
  RoutineForm: ({ onCancel }: { onCancel?: () => void }) => (
    <div aria-label="routine-form">
      <h3>Routine Basic Information</h3>
      <button onClick={onCancel} type="button">
        Cancel Routine
      </button>
    </div>
  ),
}));

jest.mock(
  "@/ui/features/athlete-development/DevelopmentReportOptionsModal",
  () => ({
    DevelopmentReportOptionsModal: ({
      isOpen,
      routines,
      onClose,
      onPreview,
    }: {
      isOpen: boolean;
      routines: Array<{ id: string }>;
      onClose: () => void;
      onPreview: (options: {
        includeEvidence: boolean;
        routineIds: string[];
      }) => void;
    }) =>
      isOpen ? (
        <div aria-label="report-options-modal" role="dialog">
          <div>{`routine-options:${routines.length}`}</div>
          <button onClick={() => onPreview({ includeEvidence: false, routineIds: [] })} type="button">
            Preview report without routines
          </button>
          <button
            onClick={() =>
              onPreview({
                includeEvidence: true,
                routineIds: routines.map((routine) => routine.id),
              })
            }
            type="button"
          >
            Preview report with selections
          </button>
          <button onClick={onClose} type="button">
            Close report modal
          </button>
        </div>
      ) : null,
  })
);

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
  evaluationHistory: [
    {
      id: "eval-2",
      disciplineId: "disc-1",
      evaluationDate: new Date("2025-12-01"),
      evaluationType: "baseline",
      phase: "offseason",
      snapshotSummary: "Older snapshot",
      strengthProfileSummary: "Older strength",
      keyConstraintsSummary: "Older constraint",
      documentData: null,
    },
  ],
  activePlan: {
    id: "plan-1",
    evaluationId: "eval-1",
    status: "active",
    startDate: new Date("2026-01-01"),
    targetEndDate: new Date("2026-02-01"),
    documentData: null,
  },
  developmentPlanHistory: [],
  playerRoutines: [],
  universalRoutines: [],
  universalRoutinesSupported: false,
  report: {
    linkedEvaluationId: "eval-1",
    canGenerate: true,
  },
  flags: {
    hasAnyDisciplineData: true,
    hasEvaluations: true,
    hasActivePlan: true,
    hasRoutines: false,
  },
} as any;

const baseRoutineFormConfig: RoutineFormConfig = {
  developmentPlanOptions: [
    {
      id: "plan-1",
      playerId: "player-1",
      disciplineId: "disc-1",
      disciplineKey: "pitching",
      disciplineLabel: "Pitching",
      status: "active",
      title: "Active plan",
    },
  ],
  disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
  mechanicOptions: [],
  drillOptions: [],
};

describe("DevelopmentTab", () => {
  beforeEach(() => {
    refresh.mockReset();
    push.mockReset();
    open.mockReset();
    Object.defineProperty(window, "open", {
      configurable: true,
      value: open,
    });
  });

  it("renders expected sections for populated state", () => {
    render(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        data={baseData}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
        routineFormConfig={baseRoutineFormConfig}
      />
    );
    const actionGroup = screen.getByRole("group", {
      name: "Development tab actions",
    });
    const tablist = screen.getByRole("tablist");

    expect(screen.getByText("Development")).toBeTruthy();
    expect(screen.getByText("Current Snapshot")).toBeTruthy();
    expect(screen.getByText("Active Plan")).toBeTruthy();
    expect(screen.getByText("Routines")).toBeTruthy();
    expect(screen.getByText("History")).toBeTruthy();
    expect(
      actionGroup.compareDocumentPosition(tablist) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
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
    expect(
      within(actionGroup).getByRole("button", {
        name: "Generate PDF Report",
      })
    ).toBeTruthy();
  });

  it("renders tabs only for evaluated disciplines", () => {
    render(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        data={{
          ...baseData,
          disciplineOptions: [
            { id: "disc-1", key: "pitching", label: "Pitching" },
            { id: "disc-3", key: "strength", label: "Strength" },
          ],
        }}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
          { id: "disc-2", key: "hitting", label: "Hitting" },
          { id: "disc-3", key: "strength", label: "Strength" },
        ]}
        evaluationBucketOptions={[]}
        routineFormConfig={baseRoutineFormConfig}
      />
    );

    expect(screen.getByRole("tab", { name: "Pitching" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Strength" })).toBeTruthy();
    expect(screen.queryByRole("tab", { name: "Hitting" })).toBeNull();
  });

  it("shows the zero-evaluation empty state when the player has no evaluations", () => {
    render(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        data={{
          ...baseData,
          latestEvaluation: null,
          evaluationHistory: [],
          report: {
            linkedEvaluationId: null,
            canGenerate: false,
          },
          disciplineOptions: [],
          selectedDiscipline: null,
          flags: {
            ...baseData.flags,
            hasAnyDisciplineData: false,
            hasEvaluations: false,
          },
        }}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
        routineFormConfig={baseRoutineFormConfig}
      />
    );

    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.getByRole("button", { name: "Create Evaluation" })).toBeTruthy();
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
          report: {
            linkedEvaluationId: null,
            canGenerate: false,
          },
          flags: { ...baseData.flags, hasAnyDisciplineData: false },
        }}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
        routineFormConfig={baseRoutineFormConfig}
      />
    );

    expect(
      screen.getByText(
        "No development data exists yet for this athlete. Add an evaluation to begin the development workflow."
      )
    ).toBeTruthy();
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.getByRole("button", { name: "Create Evaluation" })).toBeTruthy();
  });

  it("opens the manual plan drawer with current-discipline evaluation options", async () => {
    render(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        data={baseData}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
        routineFormConfig={baseRoutineFormConfig}
      />
    );

    const actionGroup = screen.getByRole("group", {
      name: "Development tab actions",
    });

    fireEvent.click(
      within(actionGroup).getByRole("button", { name: "New Development Plan" })
    );

    expect(
      await screen.findByRole("heading", { name: "New Development Plan" })
    ).toBeTruthy();
    expect(screen.getByLabelText("development-plan-form")).toBeTruthy();
    expect(screen.getByText("initial:eval-1")).toBeTruthy();
    expect(screen.getByText("count:2")).toBeTruthy();
    expect(screen.getByText("locked:false")).toBeTruthy();
  });

  it("opens the manual routine drawer with current-discipline plan options", async () => {
    render(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        data={baseData}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
        routineFormConfig={{
          developmentPlanOptions: [
            {
              id: "plan-1",
              playerId: "player-1",
              disciplineId: "disc-1",
              disciplineKey: "pitching",
              disciplineLabel: "Pitching",
              status: "active" as const,
              title: "Active plan",
            },
            {
              id: "plan-2",
              playerId: "player-1",
              disciplineId: "disc-1",
              disciplineKey: "pitching",
              disciplineLabel: "Pitching",
              status: "draft" as const,
              title: "Older plan",
            },
          ],
          disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
          mechanicOptions: [],
          drillOptions: [],
        }}
      />
    );

    const actionGroup = screen.getByRole("group", {
      name: "Development tab actions",
    });

    fireEvent.click(
      within(actionGroup).getByRole("button", { name: "New Routine" })
    );

    expect(await screen.findByRole("heading", { name: "New Routine" })).toBeTruthy();
    expect(screen.getByLabelText("routine-form")).toBeTruthy();
    expect(screen.getByText("initial-plan:plan-1")).toBeTruthy();
    expect(screen.getByText("plan-count:2")).toBeTruthy();
    expect(screen.getByText("plan-locked:false")).toBeTruthy();
  });

  it("transitions from evaluation continue into the plan drawer and then into the routine drawer", async () => {
    render(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        data={baseData}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
        routineFormConfig={{
          developmentPlanOptions: [
            {
              id: "plan-1",
              playerId: "player-1",
              disciplineId: "disc-1",
              disciplineKey: "pitching",
              disciplineLabel: "Pitching",
              status: "active" as const,
              title: "Active plan",
            },
          ],
          disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
          mechanicOptions: [],
          drillOptions: [],
        }}
      />
    );

    const actionGroup = screen.getByRole("group", {
      name: "Development tab actions",
    });

    fireEvent.click(
      within(actionGroup).getByRole("button", { name: "New Evaluation" })
    );

    expect(screen.getByLabelText("evaluation-form")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Trigger evaluation continue" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "New Development Plan" })
      ).toBeTruthy();
    });

    expect(screen.queryByLabelText("evaluation-form")).toBeNull();
    expect(screen.getByText("initial:eval-from-save")).toBeTruthy();
    expect(screen.getByText("locked:true")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Trigger plan continue" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "New Routine" })
      ).toBeTruthy();
    });

    expect(screen.getByText("initial-plan:plan-1")).toBeTruthy();
    expect(screen.getByText("plan-locked:true")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Trigger routine save" }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "New Routine" })).toBeNull();
    });

    expect(refresh).toHaveBeenCalled();
  });

  it("hides the report action when the active-plan evaluation cannot be resolved", () => {
    render(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        data={{
          ...baseData,
          report: {
            linkedEvaluationId: null,
            canGenerate: false,
          },
        }}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
        routineFormConfig={baseRoutineFormConfig}
      />
    );

    const actionGroup = screen.getByRole("group", {
      name: "Development tab actions",
    });

    expect(
      within(actionGroup).queryByRole("button", {
        name: "Generate PDF Report",
      })
    ).toBeNull();
  });

  it("opens the report options flow and opens the printable preview in a new tab", async () => {
    render(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        data={{
          ...baseData,
          playerRoutines: [
            {
              id: "routine-1",
              title: "Reset",
              routineType: "partial_lesson",
            },
          ],
        }}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
        routineFormConfig={baseRoutineFormConfig}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate PDF Report" }));

    expect(await screen.findByRole("dialog", { name: "report-options-modal" })).toBeTruthy();
    expect(screen.getByText("routine-options:1")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Preview report with selections" }));

    expect(open).toHaveBeenCalledWith(
      "/reports/development/player-1/pdf?discipline=disc-1&includeEvidence=1&routineIds=routine-1",
      "_blank",
      "noopener,noreferrer"
    );
  });
});



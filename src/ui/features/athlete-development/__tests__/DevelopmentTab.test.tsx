import type { ReactNode } from "react";

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { SWRConfig } from "swr";

import type { RoutineFormConfig } from "@/application/routines/getRoutineFormConfig";
import { DevelopmentTab } from "@/ui/features/athlete-development/DevelopmentTab";

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
      mode,
      initialEvaluation,
      onSavedAndContinue,
    }: {
      children: ReactNode;
      mode?: string;
      initialEvaluation?: { id?: string } | null;
      onSavedAndContinue?: (evaluationId: string) => void;
    }) => (
      <div>
        <div aria-label="evaluation-provider-meta">
          <span>{`mode:${mode ?? ""}`}</span>
          <span>{`initial-evaluation:${initialEvaluation?.id ?? ""}`}</span>
        </div>
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
      mode,
      evaluationOptions,
      initialEvaluationId,
      isEvaluationSelectionLocked,
      initialDevelopmentPlan,
      onSavedAndContinue,
    }: {
      children: ReactNode;
      mode?: string;
      evaluationOptions?: Array<{ id: string }>;
      initialEvaluationId?: string;
      isEvaluationSelectionLocked?: boolean;
      initialDevelopmentPlan?: { id?: string } | null;
      onSavedAndContinue?: (developmentPlanId: string) => void;
    }) => (
      <div>
        <div aria-label="development-plan-provider-meta">
          <span>{`mode:${mode ?? ""}`}</span>
          <span>{`initial:${initialEvaluationId ?? ""}`}</span>
          <span>{`initial-plan:${initialDevelopmentPlan?.id ?? ""}`}</span>
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
      initialDisciplineId,
      initialPlayerId,
      isDevelopmentPlanSelectionLocked,
      onSaved,
    }: {
      children: ReactNode;
      developmentPlanOptions?: Array<{ id: string }>;
      initialDevelopmentPlanId?: string;
      initialDisciplineId?: string;
      initialPlayerId?: string;
      isDevelopmentPlanSelectionLocked?: boolean;
      onSaved?: (routineId: string) => void;
    }) => (
      <div>
        <div aria-label="routine-provider-meta">
          <span>{`initial-player:${initialPlayerId ?? ""}`}</span>
          <span>{`initial-discipline:${initialDisciplineId ?? ""}`}</span>
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
      onPreview: (options: { routineIds: string[] }) => void;
    }) =>
      isOpen ? (
        <div aria-label="report-options-modal" role="dialog">
          <div>{`routine-options:${routines.length}`}</div>
          <button onClick={() => onPreview({ routineIds: [] })} type="button">
            Preview report without routines
          </button>
          <button
            onClick={() => onPreview({ routineIds: routines.map((routine) => routine.id) })}
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

jest.mock("@/ui/features/athlete-development/DevelopmentDocumentModal", () => ({
  DevelopmentDocumentModal: ({
    isOpen,
    documentId,
    documentType,
    onEditDocument,
    onClose,
  }: {
    isOpen: boolean;
    documentId: string | null;
    documentType: "evaluation" | "development-plan" | null;
    onEditDocument?: (
      documentId: string,
      documentType: "evaluation" | "development-plan"
    ) => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div aria-label="development-document-modal" role="dialog">
        <div>{`document:${documentType ?? ""}:${documentId ?? ""}`}</div>
        <button
          onClick={() =>
            documentId && documentType ? onEditDocument?.(documentId, documentType) : undefined
          }
          type="button"
        >
          Modal Edit
        </button>
        <button onClick={onClose} type="button">
          Close document modal
        </button>
      </div>
    ) : null,
}));

jest.mock("@/ui/features/athlete-development/CurrentSnapshotPanel", () => ({
  CurrentSnapshotPanel: ({
    latestEvaluation,
    onViewEvaluation,
    onEditEvaluation,
  }: {
    latestEvaluation: { id: string } | null;
    onViewEvaluation?: (evaluationId: string) => void;
    onEditEvaluation?: (evaluationId: string) => void;
  }) => (
    <section>
      <h3>Current Snapshot</h3>
      {latestEvaluation ? (
        <div>
          <button onClick={() => onViewEvaluation?.(latestEvaluation.id)} type="button">
            View Evaluation
          </button>
          <button onClick={() => onEditEvaluation?.(latestEvaluation.id)} type="button">
            Edit Evaluation
          </button>
        </div>
      ) : (
        <p>No evaluation exists yet for this discipline.</p>
      )}
    </section>
  ),
}));

jest.mock("@/ui/features/athlete-development/ActivePlanPanel", () => ({
  ActivePlanPanel: ({
    activePlan,
    latestEvaluation,
    onCreatePlanFromLatestEvaluation,
    onViewPlan,
    onEditPlan,
  }: {
    activePlan: { id: string } | null;
    latestEvaluation: { id: string } | null;
    onCreatePlanFromLatestEvaluation?: () => void;
    onViewPlan?: (developmentPlanId: string) => void;
    onEditPlan?: (developmentPlanId: string) => void;
  }) => (
    <section>
      <h3>Active Plan</h3>
      {activePlan ? (
        <div>
          <button onClick={() => onViewPlan?.(activePlan.id)} type="button">
            View Plan
          </button>
          <button onClick={() => onEditPlan?.(activePlan.id)} type="button">
            Edit Plan
          </button>
        </div>
      ) : latestEvaluation ? (
        <button onClick={onCreatePlanFromLatestEvaluation} type="button">
          Create Plan from Latest Evaluation
        </button>
      ) : (
        <p>No active development plan exists for this discipline.</p>
      )}
    </section>
  ),
}));

jest.mock("@/ui/features/athlete-development/DevelopmentHistoryPanel", () => ({
  DevelopmentHistoryPanel: ({
    evaluationHistory,
    developmentPlanHistory,
    onCreatePlanFromEvaluation,
    onViewEvaluation,
    onViewPlan,
    onEditEvaluation,
    onEditPlan,
  }: {
    evaluationHistory: Array<{ id: string }>;
    developmentPlanHistory: Array<{ id: string }>;
    onCreatePlanFromEvaluation?: (evaluationId: string) => void;
    onViewEvaluation?: (evaluationId: string) => void;
    onViewPlan?: (developmentPlanId: string) => void;
    onEditEvaluation?: (evaluationId: string) => void;
    onEditPlan?: (developmentPlanId: string) => void;
  }) => (
    <section>
      <h3>History</h3>
      {evaluationHistory.length === 0 && developmentPlanHistory.length === 0 ? (
        <p>No evaluation or development plan history exists yet.</p>
      ) : (
        <div>
          {evaluationHistory.map((evaluation) => (
            <div key={evaluation.id}>
              <span>{`evaluation:${evaluation.id}`}</span>
              <button onClick={() => onViewEvaluation?.(evaluation.id)} type="button">
                View Evaluation History
              </button>
              <button onClick={() => onEditEvaluation?.(evaluation.id)} type="button">
                Edit Evaluation History
              </button>
              <button
                onClick={() => onCreatePlanFromEvaluation?.(evaluation.id)}
                type="button"
              >
                Create Plan from History
              </button>
            </div>
          ))}
          {developmentPlanHistory.map((plan) => (
            <div key={plan.id}>
              <span>{`plan:${plan.id}`}</span>
              <button onClick={() => onViewPlan?.(plan.id)} type="button">
                View Plan History
              </button>
              <button onClick={() => onEditPlan?.(plan.id)} type="button">
                Edit Plan History
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  ),
}));

jest.mock("@/ui/features/athlete-development/DevelopmentActionButtons", () => ({
  DevelopmentActionButtons: ({
    canCreatePlan,
    canCreateRoutine,
    canExportPdf,
    canCopyRawJson,
    onOpenEvaluation,
    onOpenPlan,
    onOpenRoutine,
    onExportPdf,
    onCopyRawJson,
  }: {
    canCreatePlan: boolean;
    canCreateRoutine: boolean;
    canExportPdf?: boolean;
    canCopyRawJson?: boolean;
    onOpenEvaluation: () => void;
    onOpenPlan: () => void;
    onOpenRoutine: () => void;
    onExportPdf?: () => void;
    onCopyRawJson?: () => void;
  }) => (
    <div aria-label="Development tab actions" role="group">
      <button onClick={onOpenEvaluation} type="button">
        New Evaluation
      </button>
      <button disabled={!canCreatePlan} onClick={onOpenPlan} type="button">
        New Development Plan
      </button>
      <button disabled={!canCreateRoutine} onClick={onOpenRoutine} type="button">
        New Routine
      </button>
      {canExportPdf || canCopyRawJson ? (
        <>
          <button type="button">Export</button>
          {canExportPdf ? (
            <button onClick={onExportPdf} type="button">
              Generate PDF
            </button>
          ) : null}
          {canCopyRawJson ? (
            <button onClick={onCopyRawJson} type="button">
              Copy Raw JSON
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  ),
}));

jest.mock("@/ui/features/athlete-development/RoutinesPanel", () => ({
  RoutinesPanel: ({
    playerRoutines,
    onOpenRoutine,
    onOpenRoutineExport,
  }: {
    playerRoutines: Array<{ id: string }>;
    onOpenRoutine?: () => void;
    onOpenRoutineExport?: (routines: Array<{ id: string }>) => void;
  }) => (
    <section>
      <h3>Routines</h3>
      <div>{`player-routines:${playerRoutines.length}`}</div>
      <button onClick={onOpenRoutine} type="button">
        Panel New Routine
      </button>
      <button onClick={() => onOpenRoutineExport?.(playerRoutines.slice(0, 1))} type="button">
        Panel Export Routines
      </button>
    </section>
  ),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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

function buildInitialPageData(
  overrides?: Partial<{
    data: typeof baseData;
    routineFormConfig: RoutineFormConfig;
  }>
) {
  return {
    data: overrides?.data ?? baseData,
    routineFormConfig: overrides?.routineFormConfig ?? baseRoutineFormConfig,
    evaluationDisciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
    evaluationBucketOptions: [],
  };
}

function renderDevelopmentTab(node: ReactNode) {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      {node}
    </SWRConfig>
  );
}

describe("DevelopmentTab", () => {
  beforeEach(() => {
    refresh.mockReset();
    push.mockReset();
    open.mockReset();
    global.fetch = jest.fn();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
    Object.defineProperty(window, "open", {
      configurable: true,
      value: open,
    });
  });

  it("renders expected sections for populated state", () => {
    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData()}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
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
        name: "Export",
      })
    ).toBeTruthy();
  });

  it("renders tabs only for evaluated disciplines", () => {
    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData({
          data: {
            ...baseData,
            disciplineOptions: [
              { id: "disc-1", key: "pitching", label: "Pitching" },
              { id: "disc-3", key: "strength", label: "Strength" },
            ],
          },
        })}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
          { id: "disc-2", key: "hitting", label: "Hitting" },
          { id: "disc-3", key: "strength", label: "Strength" },
        ]}
        evaluationBucketOptions={[]}
      />
    );

    expect(screen.getByRole("tab", { name: "Pitching" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Strength" })).toBeTruthy();
    expect(screen.queryByRole("tab", { name: "Hitting" })).toBeNull();
  });

  it("shows the zero-evaluation empty state when the player has no evaluations", () => {
    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData({
          data: {
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
          },
        })}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
      />
    );

    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.getByRole("button", { name: "Create Evaluation" })).toBeTruthy();
  });

  it("renders empty state when no discipline data exists", () => {
    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData({
          data: {
            ...baseData,
            selectedDiscipline: null,
            disciplineOptions: [],
            report: {
              linkedEvaluationId: null,
              canGenerate: false,
            },
            flags: { ...baseData.flags, hasAnyDisciplineData: false },
          },
        })}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
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
    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData()}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
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

  it("opens the manual routine drawer with no preselected development plan", async () => {
    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData({
          routineFormConfig: {
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
          },
        })}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
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
    expect(screen.getByText("initial-plan:")).toBeTruthy();
    expect(screen.getByText("initial-discipline:disc-1")).toBeTruthy();
    expect(screen.getByText("plan-count:2")).toBeTruthy();
    expect(screen.getByText("plan-locked:false")).toBeTruthy();
  });

  it("transitions from evaluation continue into the plan drawer and then into the routine drawer", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            ...baseData,
            latestEvaluation: { ...baseData.latestEvaluation, id: "eval-from-save" },
            evaluationHistory: [],
          },
          routineFormConfig: {
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
          },
          evaluationDisciplineOptions: [
            { id: "disc-1", key: "pitching", label: "Pitching" },
          ],
          evaluationBucketOptions: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            ...baseData,
            activePlan: {
              ...baseData.activePlan,
              id: "plan-1",
            },
          },
          routineFormConfig: {
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
          },
          evaluationDisciplineOptions: [
            { id: "disc-1", key: "pitching", label: "Pitching" },
          ],
          evaluationBucketOptions: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => buildInitialPageData(),
      });

    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData({
          routineFormConfig: {
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
          },
        })}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
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

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "/api/players/player-1/development?discipline=disc-1"
    );
  });

  it("keeps raw-json export available when PDF export is unavailable", () => {
    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData({
          data: {
            ...baseData,
            report: {
              linkedEvaluationId: null,
              canGenerate: false,
            },
          },
        })}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
      />
    );

    const actionGroup = screen.getByRole("group", {
      name: "Development tab actions",
    });

    expect(within(actionGroup).getByRole("button", { name: "Export" })).toBeTruthy();
    expect(
      within(actionGroup).queryByRole("button", {
        name: "Generate PDF",
      })
    ).toBeNull();
    expect(
      within(actionGroup).getByRole("button", {
        name: "Copy Raw JSON",
      })
    ).toBeTruthy();
  });

  it("opens the report options flow and opens the printable preview in a new tab", async () => {
    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData({
          data: {
            ...baseData,
            playerRoutines: [
              {
                id: "routine-1",
                title: "Reset",
                routineType: "partial_lesson",
              },
            ],
          },
        })}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate PDF" }));

    expect(await screen.findByRole("dialog", { name: "report-options-modal" })).toBeTruthy();
    expect(screen.getByText("routine-options:1")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Preview report with selections" }));

    expect(open).toHaveBeenCalledWith(
      "/reports/routines/player-1/pdf?routineIds=routine-1",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("opens report options with the routines-panel filtered routines", async () => {
    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData({
          data: {
            ...baseData,
            playerRoutines: [
              {
                id: "routine-1",
                title: "Pitching reset",
                routineType: "partial_lesson",
                disciplineId: "disc-1",
                disciplineKey: "pitching",
                disciplineLabel: "Pitching",
              },
              {
                id: "routine-2",
                title: "Hitting reset",
                routineType: "partial_lesson",
                disciplineId: "disc-2",
                disciplineKey: "hitting",
                disciplineLabel: "Hitting",
              },
            ],
          },
        })}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Panel Export Routines" }));

    expect(await screen.findByRole("dialog", { name: "report-options-modal" })).toBeTruthy();
    expect(screen.getByText("routine-options:1")).toBeTruthy();
  });

  it("copies the active evaluation and active plan raw json from export actions", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "eval-1",
          copyPayload: {
            playerId: "player-1",
            disciplineId: "disc-1",
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "plan-1",
          copyPayload: {
            playerId: "player-1",
            evaluationId: "eval-1",
          },
        }),
      });

    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData()}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy Raw JSON" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenNthCalledWith(1, "/api/evaluations/eval-1");
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        "/api/development-plans/plan-1"
      );
    });

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify(
          {
            evaluation: {
              playerId: "player-1",
              disciplineId: "disc-1",
            },
            developmentPlan: {
              playerId: "player-1",
              evaluationId: "eval-1",
            },
          },
          null,
          2
        )
      );
    });
  });

  it("opens the evaluation edit drawer from the current snapshot card", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "eval-1",
        playerId: "player-1",
        disciplineId: "disc-1",
        createdBy: "coach-1",
        evaluationDate: new Date("2026-01-01").toISOString(),
        evaluationType: "monthly",
        phase: "preseason",
        injuryConsiderations: null,
        snapshotSummary: "Snapshot",
        strengthProfileSummary: "Strength",
        keyConstraintsSummary: "Constraint",
        documentData: null,
        details: { strengths: [], focusAreas: [], constraints: [], evidence: [] },
        evidenceForms: [],
        attachments: [],
        mediaAttachments: [],
        copyPayload: {},
      }),
    });

    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData()}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit Evaluation" }));

    expect(await screen.findByRole("heading", { name: "Edit Evaluation" })).toBeTruthy();
    expect(await screen.findByText("mode:edit")).toBeTruthy();
    expect(await screen.findByText("initial-evaluation:eval-1")).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledWith("/api/evaluations/eval-1");
  });

  it("opens the development plan edit drawer from history cards", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "plan-2",
        playerId: "player-1",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        createdBy: "coach-1",
        status: "draft",
        startDate: new Date("2026-01-02").toISOString(),
        targetEndDate: new Date("2026-02-02").toISOString(),
        documentData: null,
        details: {
          summary: "Plan",
          currentPriority: "Priority",
          shortTermGoals: [],
          longTermGoals: [],
          focusAreas: [],
          measurableIndicators: [],
        },
        linkedEvaluation: null,
        copyPayload: {},
      }),
    });

    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData({
          data: {
            ...baseData,
            developmentPlanHistory: [
              {
                id: "plan-2",
                evaluationId: "eval-1",
                status: "draft",
                startDate: new Date("2026-01-02"),
                targetEndDate: new Date("2026-02-02"),
                documentData: null,
              },
            ],
          },
        })}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit Plan History" }));

    expect(await screen.findByRole("heading", { name: "Edit Development Plan" })).toBeTruthy();
    expect(await screen.findByText("mode:edit")).toBeTruthy();
    expect(await screen.findByText("initial-plan:plan-2")).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledWith("/api/development-plans/plan-2");
  });

  it("opens edit from the document modal", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "eval-2",
        playerId: "player-1",
        disciplineId: "disc-1",
        createdBy: "coach-1",
        evaluationDate: new Date("2025-12-01").toISOString(),
        evaluationType: "baseline",
        phase: "offseason",
        injuryConsiderations: null,
        snapshotSummary: "Older snapshot",
        strengthProfileSummary: "Older strength",
        keyConstraintsSummary: "Older constraint",
        documentData: null,
        details: { strengths: [], focusAreas: [], constraints: [], evidence: [] },
        evidenceForms: [],
        attachments: [],
        mediaAttachments: [],
        copyPayload: {},
      }),
    });

    renderDevelopmentTab(
      <DevelopmentTab
        playerId="player-1"
        createdBy="coach-1"
        initialPageData={buildInitialPageData()}
        evaluationDisciplineOptions={[
          { id: "disc-1", key: "pitching", label: "Pitching" },
        ]}
        evaluationBucketOptions={[]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "View Evaluation History" }));
    expect(await screen.findByRole("dialog", { name: "development-document-modal" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Modal Edit" }));

    expect(await screen.findByRole("heading", { name: "Edit Evaluation" })).toBeTruthy();
    expect(await screen.findByText("initial-evaluation:eval-2")).toBeTruthy();
  });
});

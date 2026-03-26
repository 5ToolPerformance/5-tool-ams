import type { ReactNode } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { DevelopmentDocumentModal } from "@/ui/features/athlete-development/DevelopmentDocumentModal";

const openAttachment = jest.fn();

jest.mock("@heroui/react", () => ({
  Button: ({
    children,
    onPress,
  }: {
    children: ReactNode;
    onPress?: () => void;
  }) => <button onClick={onPress}>{children}</button>,
  Chip: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Divider: () => <hr />,
  Modal: ({
    children,
    isOpen,
  }: {
    children: ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div role="dialog">{children}</div> : null),
  ModalBody: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ModalContent: ({ children }: { children: (onClose?: () => void) => ReactNode }) => (
    <div>{children(() => undefined)}</div>
  ),
  ModalHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Spinner: ({ label }: { label?: string }) => <div>{label ?? "loading"}</div>,
}));

jest.mock("@/ui/features/attachments/AttachmentViewerProvider", () => ({
  useAttachmentViewer: () => ({
    openAttachment,
  }),
}));

describe("DevelopmentDocumentModal", () => {
  beforeEach(() => {
    openAttachment.mockReset();
    global.fetch = jest.fn();
  });

  it("renders formatted evaluation details and opens attachments", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "eval-1",
        playerId: "player-1",
        disciplineId: "disc-1",
        evaluationDate: "2026-03-18T00:00:00.000Z",
        evaluationType: "monthly",
        phase: "preseason",
        snapshotSummary: "Snapshot summary",
        strengthProfileSummary: "Strength summary",
        keyConstraintsSummary: "Constraint summary",
        details: {
          strengths: ["Explosive lower half"],
          focusAreas: [{ title: "Lead leg", description: "Brace earlier" }],
          constraints: ["Timing"],
          evidence: [{ performanceSessionId: "sess-1", notes: "Bullpen clip" }],
        },
        evidenceForms: [],
        attachments: [
          {
            id: "att-1",
            type: "file_video",
            source: "blast",
            createdAt: "2026-03-18T00:00:00.000Z",
            file: { originalFileName: "evidence.mp4" },
          },
        ],
      }),
    });

    render(
      <DevelopmentDocumentModal
        isOpen
        documentId="eval-1"
        documentType="evaluation"
        onClose={() => undefined}
      />
    );

    expect(await screen.findByText("Evaluation Details")).toBeTruthy();
    expect(await screen.findByText("Snapshot summary")).toBeTruthy();
    expect(screen.getByText("Lead leg")).toBeTruthy();
    expect(screen.getByText("evidence.mp4")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "View Attachment" }));

    expect(openAttachment).toHaveBeenCalledWith(
      expect.objectContaining({ id: "att-1" })
    );
  });

  it("renders development plan details with linked evaluation evidence", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "plan-1",
        playerId: "player-1",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        status: "active",
        startDate: "2026-03-18T00:00:00.000Z",
        targetEndDate: "2026-04-18T00:00:00.000Z",
        details: {
          summary: "Plan summary",
          currentPriority: "Get down the mound earlier",
          shortTermGoals: [{ title: "Direction", description: "Stay on line" }],
          longTermGoals: [],
          focusAreas: [],
          measurableIndicators: [
            {
              title: "Strike %",
              description: "Improve weekly",
              metricType: "percentage",
            },
          ],
        },
        linkedEvaluation: {
          id: "eval-1",
          playerId: "player-1",
          disciplineId: "disc-1",
          evaluationDate: "2026-03-01T00:00:00.000Z",
          evaluationType: "baseline",
          phase: "preseason",
          snapshotSummary: "Eval snapshot",
          strengthProfileSummary: "Eval strength",
          keyConstraintsSummary: "Eval constraint",
          details: {
            strengths: [],
            focusAreas: [],
            constraints: [],
            evidence: [],
          },
          evidenceForms: [],
          attachments: [],
        },
      }),
    });

    render(
      <DevelopmentDocumentModal
        isOpen
        documentId="plan-1"
        documentType="development-plan"
        onClose={() => undefined}
      />
    );

    expect(await screen.findByText("Development Plan Details")).toBeTruthy();
    expect(await screen.findByText("Plan summary")).toBeTruthy();
    expect(screen.getByText("Direction")).toBeTruthy();
    expect(screen.getByText("Source Evaluation Evidence")).toBeTruthy();
    expect(screen.getByText("Eval snapshot")).toBeTruthy();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/development-plans/plan-1");
    });
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";

import type { PerformanceEvidenceSession } from "@/application/players/performance/getPlayerPerformanceData.types";
import { PerformanceKpiGrid } from "@/ui/features/athlete-performance/shared/PerformanceKpiGrid";
import { PerformanceSessionViewer } from "@/ui/features/athlete-performance/shared/PerformanceSessionViewer";

jest.mock("@heroui/react", () => ({
  Accordion: ({ children }: any) => <div>{children}</div>,
  AccordionItem: ({ title, subtitle, children }: any) => (
    <details open>
      <summary>
        <span>{title}</span>
        <span>{subtitle}</span>
      </summary>
      {children}
    </details>
  ),
  Card: ({ children }: any) => <div>{children}</div>,
  CardBody: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  Chip: ({ children }: any) => <span>{children}</span>,
  Table: ({ children, ...props }: any) => <table {...props}>{children}</table>,
  TableHeader: ({ children }: any) => <thead><tr>{children}</tr></thead>,
  TableColumn: ({ children }: any) => <th>{children}</th>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableCell: ({ children }: any) => <td>{children}</td>,
}));

describe("performance evidence components", () => {
  it("renders KPI values from evaluation evidence", () => {
    render(
      <PerformanceKpiGrid
        kpis={[
          {
            key: "exitVelocityMax",
            label: "Max Exit Velocity",
            value: 96.2,
            unit: "mph",
            sourceGroup: "HitTrax",
            recordedAt: "2026-02-01T12:00:00.000Z",
            sessionId: "session-1",
          },
        ]}
      />
    );

    expect(screen.getByText("Max Exit Velocity")).toBeTruthy();
    expect(screen.getByText("96.2 mph")).toBeTruthy();
    expect(screen.getByText("HitTrax")).toBeTruthy();
  });

  it("opens session viewers and renders the full session table", () => {
    const session: PerformanceEvidenceSession = {
      id: "session-1",
      evaluationId: "evaluation-1",
      discipline: "hitting",
      source: "hittrax",
      sourceLabel: "HitTrax",
      recordedAt: "2026-02-01T12:00:00.000Z",
      status: "completed",
      notes: "Good contact",
      metrics: [],
      tableColumns: [
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value" },
      ],
      tableRows: [
        {
          id: "exitVelocityMax",
          cells: {
            metric: "Max Exit Velocity",
            value: "96.2 mph",
          },
        },
      ],
    };

    render(<PerformanceSessionViewer sessions={[session]} />);

    expect(screen.getByText("Good contact")).toBeTruthy();
    expect(screen.getByText("Metric")).toBeTruthy();
    expect(screen.getByText("Max Exit Velocity")).toBeTruthy();
    expect(screen.getByText("96.2 mph")).toBeTruthy();
  });
});

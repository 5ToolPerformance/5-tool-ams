import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import type {
  PerformanceEvidenceSession,
  PlayerPerformanceDisciplineData,
} from "@/application/players/performance/getPlayerPerformanceData.types";
import { PerformanceEvidenceTab } from "@/ui/features/athlete-performance/shared/PerformanceEvidenceTab";
import { PerformanceKpiGrid } from "@/ui/features/athlete-performance/shared/PerformanceKpiGrid";
import { PerformanceSessionViewer } from "@/ui/features/athlete-performance/shared/PerformanceSessionViewer";
import { PerformanceTrendCharts } from "@/ui/features/athlete-performance/shared/PerformanceTrendCharts";

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
  CardHeader: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  Chip: ({ children }: any) => <span>{children}</span>,
  Table: ({ children, ...props }: any) => <table {...props}>{children}</table>,
  TableHeader: ({ children }: any) => <thead><tr>{children}</tr></thead>,
  TableColumn: ({ children }: any) => <th>{children}</th>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  Select: ({
    children,
    "aria-label": ariaLabel,
    onSelectionChange,
    renderValue,
    selectedKeys,
  }: any) => {
    const selectedKey = Array.from(selectedKeys as Set<string>)[0] ?? "";
    const options = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }
      const option = child as React.ReactElement<{ children: React.ReactNode }>;

      return (
        <option value={String(option.key)}>
          {option.props.children}
        </option>
      );
    });

    return (
      <>
        {renderValue ? (
          <span data-testid="selected-trend-title">{renderValue()}</span>
        ) : null}
        <select
          aria-label={ariaLabel}
          value={String(selectedKey)}
          onChange={(event) =>
            onSelectionChange(new Set([event.currentTarget.value]))
          }
        >
          {options}
        </select>
      </>
    );
  },
  SelectItem: ({ children }: any) => <>{children}</>,
}));

jest.mock("recharts", () => ({
  CartesianGrid: () => null,
  Line: () => null,
  LineChart: ({ children }: any) => <div>{children}</div>,
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="trend-chart">{children}</div>
  ),
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
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

  it("limits the performance tab KPI grid to configured featured metrics", () => {
    const data: PlayerPerformanceDisciplineData = {
      discipline: "hitting",
      sessions: [
        {
          id: "session-1",
          evaluationId: "evaluation-1",
          discipline: "hitting",
          source: "hittrax",
          sourceLabel: "HitTrax",
          recordedAt: "2026-02-01T12:00:00.000Z",
          status: "completed",
          notes: null,
          metrics: [],
          tableColumns: [{ key: "metric", label: "Metric" }],
          tableRows: [],
        },
      ],
      kpis: [
        {
          key: "exitVelocityAvg",
          label: "Avg Exit Velocity",
          value: 84.6,
          unit: "mph",
          sourceGroup: "HitTrax",
          recordedAt: "2026-02-01T12:00:00.000Z",
          sessionId: "session-1",
        },
        {
          key: "hardHitPercent",
          label: "Hard Hit %",
          value: 48,
          unit: "%",
          sourceGroup: "HitTrax",
          recordedAt: "2026-02-01T12:00:00.000Z",
          sessionId: "session-1",
        },
        {
          key: "batSpeedAvg",
          label: "Avg Bat Speed",
          value: 71.8,
          unit: "mph",
          sourceGroup: "Blast",
          recordedAt: "2026-02-01T12:00:00.000Z",
          sessionId: "session-1",
        },
        {
          key: "onPlanePercent",
          label: "On Plane %",
          value: 62,
          unit: "%",
          sourceGroup: "Blast",
          recordedAt: "2026-02-01T12:00:00.000Z",
          sessionId: "session-1",
        },
        {
          key: "exitVelocityMax",
          label: "Max Exit Velocity",
          value: 96.2,
          unit: "mph",
          sourceGroup: "HitTrax",
          recordedAt: "2026-02-01T12:00:00.000Z",
          sessionId: "session-1",
        },
      ],
      trends: [],
    };

    render(
      <PerformanceEvidenceTab
        data={data}
        title="Hitting"
        emptyTitle="No hitting evidence yet"
        emptyDescription="No hitting evidence."
        featuredKpiKeys={[
          "HitTrax:exitVelocityAvg",
          "HitTrax:hardHitPercent",
          "Blast:batSpeedAvg",
          "Blast:onPlanePercent",
        ]}
      />
    );

    expect(screen.getByText("Avg Exit Velocity")).toBeTruthy();
    expect(screen.getByText("Hard Hit %")).toBeTruthy();
    expect(screen.getByText("Avg Bat Speed")).toBeTruthy();
    expect(screen.getByText("On Plane %")).toBeTruthy();
    expect(screen.queryByText("Max Exit Velocity")).toBeNull();
  });

  it("renders two selectable trend charts and updates selected metrics", () => {
    render(
      <PerformanceTrendCharts
        featuredTrendKeys={["HitTrax:hardHitPercent"]}
        trends={[
          {
            key: "HitTrax:exitVelocityAvg",
            label: "Avg Exit Velocity",
            unit: "mph",
            sourceGroup: "HitTrax",
            points: [
              {
                date: "2026-02-01T12:00:00.000Z",
                value: 84.6,
                sessionId: "session-1",
              },
            ],
          },
          {
            key: "HitTrax:hardHitPercent",
            label: "Hard Hit %",
            unit: "%",
            sourceGroup: "HitTrax",
            points: [
              {
                date: "2026-02-01T12:00:00.000Z",
                value: 48,
                sessionId: "session-1",
              },
            ],
          },
          {
            key: "Blast:batSpeedAvg",
            label: "Avg Bat Speed",
            unit: "mph",
            sourceGroup: "Blast",
            points: [
              {
                date: "2026-02-01T12:00:00.000Z",
                value: 71.8,
                sessionId: "session-1",
              },
            ],
          },
        ]}
      />
    );

    expect(screen.getAllByTestId("trend-chart")).toHaveLength(2);
    expect(screen.getAllByTestId("selected-trend-title")[0]).toHaveTextContent(
      "HitTrax - Hard Hit %"
    );
    expect(screen.getAllByTestId("selected-trend-title")[1]).toHaveTextContent(
      "HitTrax - Avg Exit Velocity"
    );
    expect(screen.getByLabelText("Primary trend metric")).toHaveValue(
      "HitTrax:hardHitPercent"
    );
    expect(screen.getByLabelText("Comparison trend metric")).toHaveValue(
      "HitTrax:exitVelocityAvg"
    );
    expect(screen.getByRole("option", { name: "HitTrax - Avg Exit Velocity" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "HitTrax - Hard Hit %" })).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Primary trend metric"), {
      target: { value: "Blast:batSpeedAvg" },
    });

    expect(screen.getAllByTestId("selected-trend-title")[0]).toHaveTextContent(
      "Blast - Avg Bat Speed"
    );
    expect(screen.getByLabelText("Primary trend metric")).toHaveValue(
      "Blast:batSpeedAvg"
    );
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

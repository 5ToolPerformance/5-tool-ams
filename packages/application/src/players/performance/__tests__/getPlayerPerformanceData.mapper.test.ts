import { buildPlayerPerformanceData } from "@/application/players/performance/getPlayerPerformanceData.mapper";

const baseDate = "2026-02-01T12:00:00.000Z";

describe("buildPlayerPerformanceData", () => {
  it("maps strength evidence into KPIs, trends, and metric table sessions", () => {
    const data = buildPlayerPerformanceData({
      strengthRows: [
        {
          sessionId: "strength-session-1",
          evaluationId: "evaluation-1",
          source: "strength",
          recordedAt: baseDate,
          status: "completed",
          notes: "Baseline",
          metrics: {
            powerRating: "82",
            rotation: "74",
            lowerBodyStrength: "88",
            upperBodyStrength: "79",
          },
        },
      ],
      hittraxRows: [],
      blastRows: [],
    });

    expect(data.strength.kpis.map((kpi) => kpi.label)).toEqual([
      "Power Rating",
      "Rotation",
      "Lower Body Strength",
      "Upper Body Strength",
    ]);
    expect(data.strength.trends).toHaveLength(4);
    expect(data.strength.sessions[0].tableRows).toEqual([
      {
        id: "powerRating",
        cells: {
          metric: "Power Rating",
          value: "82",
          source: "Strength",
        },
      },
      {
        id: "rotation",
        cells: {
          metric: "Rotation",
          value: "74",
          source: "Strength",
        },
      },
      {
        id: "lowerBodyStrength",
        cells: {
          metric: "Lower Body Strength",
          value: "88",
          source: "Strength",
        },
      },
      {
        id: "upperBodyStrength",
        cells: {
          metric: "Upper Body Strength",
          value: "79",
          source: "Strength",
        },
      },
    ]);
  });

  it("combines HitTrax and Blast evidence under hitting", () => {
    const data = buildPlayerPerformanceData({
      strengthRows: [],
      hittraxRows: [
        {
          sessionId: "hittrax-session-1",
          evaluationId: "evaluation-1",
          source: "hittrax",
          recordedAt: "2026-02-02T12:00:00.000Z",
          status: "completed",
          notes: null,
          metrics: {
            exitVelocityMax: "96.2",
            exitVelocityAvg: "84.6",
          },
        },
      ],
      blastRows: [
        {
          sessionId: "blast-session-1",
          evaluationId: "evaluation-2",
          source: "blast",
          recordedAt: "2026-02-03T12:00:00.000Z",
          status: "completed",
          notes: null,
          metrics: {
            batSpeedMax: "71.8",
            attackAngleAvg: "11.6",
            powerAvg: "54.2",
          },
        },
      ],
    });

    expect(data.hitting.sessions.map((session) => session.source)).toEqual([
      "blast",
      "hittrax",
    ]);
    expect(data.hitting.kpis.map((kpi) => kpi.label)).toEqual([
      "Max Bat Speed",
      "Avg Attack Angle",
      "Power Avg",
      "Max Exit Velocity",
      "Avg Exit Velocity",
    ]);
  });

  it("maps raw strength evidence metrics into trends and session tables", () => {
    const data = buildPlayerPerformanceData({
      strengthRows: [
        {
          sessionId: "strength-session-1",
          evaluationId: "evaluation-1",
          source: "strength",
          recordedAt: baseDate,
          status: "completed",
          notes: "Raw tests",
          metrics: {
            plyoPushup: "18",
            seatedShoulderErL: "22",
            seatedShoulderErR: "24",
            cmjPeakPower: "4200",
            midThighPull: "650",
            scoopToss: "34",
          },
        },
      ],
      hittraxRows: [],
      blastRows: [],
    });

    expect(data.strength.kpis.map((kpi) => kpi.label)).toEqual([
      "Plyo Pushup",
      "Seated Shoulder ER Left",
      "Seated Shoulder ER Right",
      "CMJ Peak Power",
      "Mid Thigh Pull",
      "Scoop Toss",
    ]);
    expect(data.strength.trends.map((trend) => trend.label)).toContain(
      "CMJ Peak Power"
    );
    expect(data.strength.sessions[0].tableRows).toEqual(
      expect.arrayContaining([
        {
          id: "plyoPushup",
          cells: {
            metric: "Plyo Pushup",
            value: "18",
            source: "Strength",
          },
        },
        {
          id: "midThighPull",
          cells: {
            metric: "Mid Thigh Pull",
            value: "650",
            source: "Strength",
          },
        },
      ])
    );
  });

  it("skips missing and non-numeric metric values", () => {
    const data = buildPlayerPerformanceData({
      strengthRows: [
        {
          sessionId: "strength-session-1",
          evaluationId: "evaluation-1",
          source: "strength",
          recordedAt: baseDate,
          status: "completed",
          notes: null,
          metrics: {
            powerRating: null,
            rotation: "",
            lowerBodyStrength: "not-a-number",
            upperBodyStrength: "79",
          },
        },
      ],
      hittraxRows: [],
      blastRows: [],
    });

    expect(data.strength.kpis).toHaveLength(1);
    expect(data.strength.kpis[0].label).toBe("Upper Body Strength");
  });

  it("uses HitTrax event rows for the full session table when present", () => {
    const data = buildPlayerPerformanceData({
      strengthRows: [],
      hittraxRows: [
        {
          sessionId: "hittrax-session-1",
          evaluationId: "evaluation-1",
          source: "hittrax",
          recordedAt: baseDate,
          status: "completed",
          notes: null,
          metrics: {
            exitVelocityMax: "95",
          },
        },
      ],
      blastRows: [],
      hittraxEventsBySessionId: {
        "hittrax-session-1": [
          {
            id: "event-2",
            sessionId: "hittrax-session-1",
            eventIndex: 2,
            atBat: 1,
            pitchVelocity: "82.4",
            pitchType: "Fastball",
            exitVelo: "90.1",
            launchAngle: "12.3",
            distance: "250",
            horizontalAngle: null,
            contactType: "Line drive",
            result: "Single",
          },
        ],
      },
    });

    expect(data.hitting.sessions[0].tableColumns.map((column) => column.key)).toContain(
      "eventIndex"
    );
    expect(data.hitting.sessions[0].tableRows[0].cells.exitVelo).toBe(
      "90.1 mph"
    );
  });

  it("returns an empty pitching model", () => {
    const data = buildPlayerPerformanceData({
      strengthRows: [],
      hittraxRows: [],
      blastRows: [],
    });

    expect(data.pitching).toEqual({
      discipline: "pitching",
      kpis: [],
      trends: [],
      sessions: [],
    });
  });
});

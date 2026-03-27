import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { UniversalRoutinesLibraryPageClient } from "@/ui/features/routines/UniversalRoutinesLibraryPageClient";

const originalFetch = global.fetch;
const originalConfirm = window.confirm;

jest.mock("@heroui/react", () => {
  const actual = jest.requireActual("@heroui/react");

  return {
    ...actual,
    Button: ({ children, onPress, onClick, ...props }: any) => (
      <button type="button" onClick={onPress ?? onClick} {...props}>
        {children}
      </button>
    ),
  };
});

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("UniversalRoutinesLibraryPageClient", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    window.confirm = jest.fn(() => true);
  });

  afterAll(() => {
    global.fetch = originalFetch;
    window.confirm = originalConfirm;
  });

  const routines = [
    {
      id: "routine-1",
      createdBy: "coach-1",
      createdByName: "Coach One",
      title: "Active Routine",
      description: "desc",
      routineType: "partial_lesson" as const,
      disciplineId: "disc-1",
      disciplineKey: "pitching",
      disciplineLabel: "Pitching",
      isActive: true,
      sortOrder: 0,
      documentData: {
        overview: { summary: "summary" },
        mechanics: [],
        blocks: [],
      },
    },
    {
      id: "routine-2",
      createdBy: "coach-2",
      createdByName: "Coach Two",
      title: "Hidden Routine",
      description: "desc",
      routineType: "progression" as const,
      disciplineId: "disc-1",
      disciplineKey: "pitching",
      disciplineLabel: "Pitching",
      isActive: false,
      sortOrder: 1,
      documentData: {
        overview: { summary: "summary" },
        mechanics: [],
        blocks: [],
      },
    },
  ];

  it("shows the admin hide action and excludes hidden routines by default", () => {
    render(
      <UniversalRoutinesLibraryPageClient
        routines={routines}
        disciplineOptions={[{ id: "disc-1", key: "pitching", label: "Pitching" }]}
        viewerRole="admin"
        viewerUserId="admin-1"
      />
    );

    expect(screen.getByText("Active Routine")).toBeTruthy();
    expect(screen.queryByText("Hidden Routine")).toBeNull();
    expect(screen.getByRole("button", { name: "Hide Routine" })).toBeTruthy();
  });

  it("does not show the hide action to non-admins", () => {
    render(
      <UniversalRoutinesLibraryPageClient
        routines={routines}
        disciplineOptions={[{ id: "disc-1", key: "pitching", label: "Pitching" }]}
        viewerRole="coach"
        viewerUserId="coach-1"
      />
    );

    expect(screen.queryByRole("button", { name: "Hide Routine" })).toBeNull();
    expect(screen.queryByText("Hidden Routine")).toBeNull();
  });

  it("hides a routine from the default active list after an admin hides it", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "routine-1" }),
    });

    render(
      <UniversalRoutinesLibraryPageClient
        routines={[routines[0]]}
        disciplineOptions={[{ id: "disc-1", key: "pitching", label: "Pitching" }]}
        viewerRole="admin"
        viewerUserId="admin-1"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Hide Routine" }));

    await waitFor(() => {
      expect(screen.queryByText("Active Routine")).toBeNull();
    });
  });
});

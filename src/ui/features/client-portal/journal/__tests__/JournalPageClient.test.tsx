import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { JournalPageClient } from "@/ui/features/client-portal/journal/JournalPageClient";

const pushMock = jest.fn();
const refreshMock = jest.fn();
const toastError = jest.fn();
const readActionMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
  useSearchParams: () => new URLSearchParams("playerId=player-1"),
}));

jest.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: jest.fn(),
  },
}));

jest.mock("@/app/actions/journal", () => ({
  createJournalEntryAction: jest.fn(),
  updateJournalEntryAction: jest.fn(),
  deleteJournalEntryAction: jest.fn(),
  getJournalEntryReadAction: (...args: unknown[]) => readActionMock(...args),
}));

jest.mock("@heroui/react", () => {
  const React = require("react");

  const passThrough =
    (tag = "div") =>
    ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement(tag, props, children);

  return {
    Button: ({ children, onPress, isDisabled, isLoading, isIconOnly, startContent, ...props }: any) => (
      <button onClick={onPress} disabled={isDisabled || isLoading} {...props}>
        {startContent}
        {children}
      </button>
    ),
    Card: passThrough("div"),
    CardBody: passThrough("div"),
    CardHeader: passThrough("div"),
    Chip: passThrough("span"),
    Divider: () => <hr />,
    Drawer: ({ children, isOpen }: any) => (isOpen ? <div>{children}</div> : null),
    DrawerBody: passThrough("div"),
    DrawerContent: passThrough("div"),
    DrawerHeader: passThrough("div"),
    Modal: ({ children, isOpen }: any) => (isOpen ? <div>{children}</div> : null),
    ModalBody: passThrough("div"),
    ModalContent: passThrough("div"),
    ModalFooter: passThrough("div"),
    ModalHeader: passThrough("div"),
    Tabs: ({ children }: any) => <div>{children}</div>,
    Tab: ({ title }: any) => <button>{title}</button>,
    Accordion: passThrough("div"),
    AccordionItem: passThrough("div"),
    Input: ({ label, value, onChange, ...props }: any) => (
      <label>
        {label}
        <input value={value ?? ""} onChange={onChange} {...props} />
      </label>
    ),
    Select: ({ label, selectedKeys, onChange, children }: any) => (
      <label>
        {label}
        <select value={selectedKeys?.[0] ?? ""} onChange={onChange}>
          <option value="" />
          {children}
        </select>
      </label>
    ),
    SelectItem: ({ children, ...props }: any) => <option {...props}>{children}</option>,
    Switch: ({ children, isSelected, onValueChange }: any) => (
      <label>
        <input
          type="checkbox"
          checked={Boolean(isSelected)}
          onChange={(event) => onValueChange(event.target.checked)}
        />
        {children}
      </label>
    ),
    Textarea: ({ label, value, onChange, ...props }: any) => (
      <label>
        {label}
        <textarea value={value ?? ""} onChange={onChange} {...props} />
      </label>
    ),
  };
});

describe("JournalPageClient", () => {
  it("renders feed entries and loads detail when expanded", async () => {
    readActionMock.mockResolvedValue({
      success: true,
      data: {
        id: "entry-1",
        playerId: "player-1",
        entryType: "throwing",
        entryDate: "2026-04-01",
        contextType: "practice",
        title: "Bullpen day",
        summaryNote: "Good session",
        createdOn: "2026-04-01T12:00:00.000Z",
        updatedOn: "2026-04-01T12:00:00.000Z",
        overallFeel: 4,
        confidenceScore: 4,
        sessionNote: "Felt crisp",
        workloadSegments: [
          {
            id: "segment-1",
            throwType: "bullpen",
            throwCount: 32,
            pitchCount: 28,
            intentLevel: "high",
            velocityAvg: 85,
            velocityMax: 87,
            pitchType: null,
            durationMinutes: null,
            notes: "Short box first",
            isEstimated: false,
          },
        ],
        armCheckin: null,
        highlights: [{ label: "32 throws", tone: "primary" }],
      },
    });

    render(
      <JournalPageClient
        playerId="player-1"
        playerName="Ava Stone"
        selectedFilter="all"
        canLogActivity
        entries={[
          {
            id: "entry-1",
            playerId: "player-1",
            entryDate: "2026-04-01",
            entryType: "throwing",
            contextType: "practice",
            title: "Bullpen day",
            summary: "Felt crisp",
            createdOn: "2026-04-01T12:00:00.000Z",
            highlights: [{ label: "32 throws", tone: "primary" }],
          },
        ]}
      />
    );

    expect(screen.getByText("Bullpen day")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    await waitFor(() => {
      expect(readActionMock).toHaveBeenCalledWith("entry-1");
      expect(screen.getByText("Short box first")).toBeInTheDocument();
    });
  });
});

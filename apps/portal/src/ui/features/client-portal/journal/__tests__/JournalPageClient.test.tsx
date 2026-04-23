import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { JournalPageClient } from "@/ui/features/client-portal/journal/JournalPageClient";

const createActionMock = jest.fn();
const updateActionMock = jest.fn();
const deleteActionMock = jest.fn();
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
  createJournalEntryAction: (...args: unknown[]) => createActionMock(...args),
  updateJournalEntryAction: (...args: unknown[]) => updateActionMock(...args),
  deleteJournalEntryAction: (...args: unknown[]) => deleteActionMock(...args),
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
    AccordionItem: ({ children, title }: any) => {
      const [open, setOpen] = React.useState(false);
      return (
        <div>
          <button type="button" onClick={() => setOpen((current: boolean) => !current)}>
            {title}
          </button>
          {open ? <div>{children}</div> : null}
        </div>
      );
    },
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
    Slider: ({ "aria-label": ariaLabel, value, onChange, minValue, maxValue, step }: any) => (
      <input
        aria-label={ariaLabel}
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    ),
    Textarea: ({ label, value, onChange, minRows: _minRows, ...props }: any) => (
      <label>
        {label}
        <textarea value={value ?? ""} onChange={onChange} {...props} />
      </label>
    ),
  };
});

describe("JournalPageClient", () => {
  beforeEach(() => {
    createActionMock.mockReset();
    updateActionMock.mockReset();
    deleteActionMock.mockReset();
    readActionMock.mockReset();
    pushMock.mockReset();
    refreshMock.mockReset();
    toastError.mockReset();
  });

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

  it("keeps advanced pitching details collapsed by default and submits readiness sliders", async () => {
    createActionMock.mockResolvedValue({
      success: true,
      data: { id: "new-entry" },
    });

    render(
      <JournalPageClient
        playerId="player-1"
        playerName="Ava Stone"
        selectedFilter="all"
        canLogActivity
        entries={[]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /create first entry/i }));

    expect(screen.getByLabelText("Throw type")).toBeInTheDocument();
    expect(screen.getByLabelText("Throw count")).toBeInTheDocument();
    expect(screen.getByLabelText("Intent")).toBeInTheDocument();
    expect(screen.queryByLabelText("Pitch count")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Duration (min)")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Arm soreness"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Arm soreness"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("Body fatigue"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Arm fatigue"), { target: { value: "5" } });

    fireEvent.click(screen.getByRole("button", { name: "Advanced details" }));
    expect(screen.getByLabelText("Pitch count")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    await waitFor(() => {
      expect(createActionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          entryType: "throwing",
          armCheckin: expect.objectContaining({
            armSoreness: 0,
            bodyFatigue: 3,
            armFatigue: 5,
          }),
          workloadSegments: [
            expect.objectContaining({
              pitchCount: null,
              durationMinutes: null,
              velocityAvg: null,
              velocityMax: null,
              pitchType: null,
              notes: null,
            }),
          ],
        })
      );
    });
  });
});

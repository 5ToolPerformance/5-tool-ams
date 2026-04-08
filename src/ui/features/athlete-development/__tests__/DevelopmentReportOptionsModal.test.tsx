import type { ReactNode } from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import { DevelopmentReportOptionsModal } from "@/ui/features/athlete-development/DevelopmentReportOptionsModal";

jest.mock("@heroui/react", () => ({
  Button: ({
    children,
    onPress,
  }: {
    children: ReactNode;
    onPress?: () => void;
  }) => (
    <button onClick={onPress} type="button">
      {children}
    </button>
  ),
  Checkbox: ({
    children,
    isSelected,
    onValueChange,
  }: {
    children: ReactNode;
    isSelected?: boolean;
    onValueChange?: (value: boolean) => void;
  }) => (
    <label>
      <input
        checked={Boolean(isSelected)}
        onChange={(event) => onValueChange?.(event.target.checked)}
        type="checkbox"
      />
      {children}
    </label>
  ),
  Modal: ({
    children,
    isOpen,
  }: {
    children: ReactNode;
    isOpen?: boolean;
  }) => (isOpen ? <div>{children}</div> : null),
  ModalBody: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ModalContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ModalFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ModalHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe("DevelopmentReportOptionsModal", () => {
  it("starts with routines unselected", () => {
    render(
      <DevelopmentReportOptionsModal
        isOpen
        playerName="Ava Stone"
        routines={[
          {
            id: "routine-1",
            title: "Direction Reset",
            routineType: "partial_lesson",
          },
        ]}
        onClose={jest.fn()}
        onPreview={jest.fn()}
      />
    );

    expect(
      (screen.getByRole("checkbox", {
        name: /Direction Reset/i,
      }) as HTMLInputElement).checked
    ).toBe(false);
  });

  it("passes selected options to preview", () => {
    const onPreview = jest.fn();

    render(
      <DevelopmentReportOptionsModal
        isOpen
        playerName="Ava Stone"
        routines={[
          {
            id: "routine-1",
            title: "Direction Reset",
            routineType: "partial_lesson",
          },
        ]}
        onClose={jest.fn()}
        onPreview={onPreview}
      />
    );

    fireEvent.click(screen.getByRole("checkbox", { name: /Direction Reset/i }));
    fireEvent.click(screen.getByRole("button", { name: "Open PDF" }));

    expect(onPreview).toHaveBeenCalledWith({
      routineIds: ["routine-1"],
    });
  });
});

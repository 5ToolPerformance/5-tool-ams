import React, { type ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { DrillForm } from "@/ui/features/drills/DrillForm";

const push = jest.fn();
const refresh = jest.fn();
const toastSuccess = jest.fn();
const toastError = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

jest.mock("@/ui/features/drills/DrillTagInput", () => ({
  DrillTagInput: ({ tags }: { tags: string[] }) => (
    <div>{`tags:${tags.join(",")}`}</div>
  ),
}));

jest.mock("@heroui/react", () => ({
  Button: ({
    children,
    onPress,
    onClick,
    isDisabled,
    isLoading: _isLoading,
    ...props
  }: any) => (
    <button type="button" onClick={onPress ?? onClick} disabled={isDisabled} {...props}>
      {children}
    </button>
  ),
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardBody: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Input: ({
    label,
    value,
    onValueChange,
    "aria-label": ariaLabel,
    ...props
  }: any) => (
    <label>
      <span>{label ?? ariaLabel}</span>
      <input
        aria-label={label ?? ariaLabel}
        value={value ?? ""}
        onChange={(event) => onValueChange?.(event.target.value)}
        {...props}
      />
    </label>
  ),
  Textarea: ({ label, value, onValueChange, ...props }: any) => (
    <label>
      <span>{label}</span>
      <textarea
        aria-label={label}
        value={value ?? ""}
        onChange={(event) => onValueChange?.(event.target.value)}
        {...props}
      />
    </label>
  ),
  Select: ({ children, selectedKeys, onSelectionChange, label, ...props }: any) => {
    const selected = Array.from(selectedKeys ?? [])[0] ?? "";

    return (
      <label>
        <span>{label}</span>
        <select
          aria-label={label}
          value={String(selected)}
          onChange={(event) =>
            onSelectionChange?.(new Set(event.target.value ? [event.target.value] : []))
          }
          {...props}
        >
          {children}
        </select>
      </label>
    );
  },
  SelectItem: ({ children, value, id, itemKey }: any) => (
    <option value={value ?? itemKey ?? id ?? String(children)}>{children}</option>
  ),
}));

describe("DrillForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("uses the embedded success callback instead of navigating on create", async () => {
    const onSaved = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        drill: {
          id: "drill-1",
          title: "New drill",
          description: "desc",
          discipline: "pitching",
          videoProvider: null,
          videoId: null,
          videoUrl: null,
          createdBy: { id: "coach-1", name: "Coach" },
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
          tags: [],
          media: [],
        },
      }),
    });

    render(<DrillForm mode="create" initialDiscipline="pitching" onSaved={onSaved} />);

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "New drill" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "desc" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Drill" }));

    await waitFor(() => expect(onSaved).toHaveBeenCalled());

    expect(push).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalledWith("Drill created");
  });

  it("keeps the standalone create redirect when no embedded callback is provided", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        drill: {
          id: "drill-2",
          title: "Standalone drill",
          description: "desc",
          discipline: "pitching",
          videoProvider: null,
          videoId: null,
          videoUrl: null,
          createdBy: { id: "coach-1", name: "Coach" },
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
          tags: [],
          media: [],
        },
      }),
    });

    render(<DrillForm mode="create" initialDiscipline="pitching" />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Standalone drill" },
    });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "desc" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Drill" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/resources/drills"));
    expect(refresh).toHaveBeenCalled();
  });
});

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { AthleteTabs } from "@/ui/core/athletes/AthleteTabs";

jest.mock("@heroui/react", () => ({
  Tabs: ({ children, onSelectionChange }: any) => (
    <div role="tablist">
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, {
          onSelect: () => onSelectionChange?.(String(child.key)),
        })
      )}
    </div>
  ),
  Tab: ({ title, onSelect }: any) => (
    <button type="button" role="tab" onClick={onSelect}>
      {title}
    </button>
  ),
}));

describe("AthleteTabs", () => {
  it("includes the Performance tab and emits performance selection", () => {
    const onChange = jest.fn();

    render(<AthleteTabs activeKey="overview" onChange={onChange} />);

    fireEvent.click(screen.getByRole("tab", { name: "Performance" }));

    expect(screen.getByRole("tab", { name: "Performance" })).toBeTruthy();
    expect(onChange).toHaveBeenCalledWith("performance");
  });
});

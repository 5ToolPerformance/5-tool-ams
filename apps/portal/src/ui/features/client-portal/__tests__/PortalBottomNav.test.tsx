import { render, screen } from "@testing-library/react";

import { PortalBottomNav } from "@/ui/features/client-portal/PortalBottomNav";

jest.mock("next/navigation", () => ({
  usePathname: () => "/messages",
  useSearchParams: () =>
    new URLSearchParams("playerId=player-123"),
}));

describe("PortalBottomNav", () => {
  it("preserves the selected player in portal navigation links", () => {
    render(<PortalBottomNav />);

    expect(screen.getByRole("link", { name: /profile/i }).getAttribute("href")).toBe(
      "/?playerId=player-123"
    );
    expect(
      screen.getByRole("link", { name: /messages/i }).getAttribute("href")
    ).toBe("/messages?playerId=player-123");
  });
});

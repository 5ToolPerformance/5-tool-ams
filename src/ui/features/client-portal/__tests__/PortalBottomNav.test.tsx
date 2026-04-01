import { render, screen } from "@testing-library/react";

import { PortalBottomNav } from "@/ui/features/client-portal/PortalBottomNav";

jest.mock("next/navigation", () => ({
  usePathname: () => "/portal/messages",
  useSearchParams: () =>
    new URLSearchParams("playerId=player-123"),
}));

describe("PortalBottomNav", () => {
  it("preserves the selected player in portal navigation links", () => {
    render(<PortalBottomNav />);

    expect(screen.getByRole("link", { name: /profile/i }).getAttribute("href")).toBe(
      "/portal?playerId=player-123"
    );
    expect(
      screen.getByRole("link", { name: /messages/i }).getAttribute("href")
    ).toBe("/portal/messages?playerId=player-123");
  });
});

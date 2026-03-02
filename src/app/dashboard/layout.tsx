import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Avatar, Card, CardBody } from "@heroui/react";

import { getAuthContext } from "@/lib/auth/auth-context";
import { UserService } from "@/lib/services/users";
import { DashboardPageShell } from "@/ui/features/dashboard/DashboardPageShell";
import { DashboardTabsController } from "@/ui/features/dashboard/DashboardTabsController";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const ctx = await getAuthContext();

  if (ctx.role === "player") {
    if (ctx.playerId) {
      redirect(`/players/${ctx.playerId}/overview`);
    }
    redirect("/profile");
  }

  if (ctx.role === "coach") {
    redirect("/players");
  }

  const user = await UserService.getUserByIdScoped(ctx.userId, ctx.facilityId);

  return (
    <DashboardPageShell>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-default-500">Facility analytics for players, coaches, and lessons.</p>
        </div>
        <Card shadow="sm" className="w-full md:w-auto">
          <CardBody className="flex flex-row items-center gap-3 py-3">
            <Avatar
              src={user?.image ?? undefined}
              name={user?.name ?? ctx.email}
              size="sm"
              showFallback
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name ?? "Admin User"}</p>
              <p className="truncate text-xs text-default-500">{ctx.email}</p>
              <p className="text-xs uppercase text-default-400">{ctx.role}</p>
            </div>
          </CardBody>
        </Card>
      </div>
      <DashboardTabsController />
      <div className="space-y-6 pt-2">{children}</div>
    </DashboardPageShell>
  );
}

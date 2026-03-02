import { notFound, redirect } from "next/navigation";

import { getDashboardCoachesData } from "@/application/dashboard/getDashboardCoachesData";
import { getDashboardOverviewData } from "@/application/dashboard/getDashboardOverviewData";
import { getDashboardPlayersData } from "@/application/dashboard/getDashboardPlayersData";
import { getDashboardRangeWindow } from "@/domain/dashboard/range";
import { DashboardTabKey } from "@/domain/dashboard/types";
import { getAuthContext } from "@/lib/auth/auth-context";
import { DashboardCoachesTab } from "@/ui/features/dashboard/DashboardCoachesTab";
import { DashboardOverviewTab } from "@/ui/features/dashboard/DashboardOverviewTab";
import { DashboardPlayersTab } from "@/ui/features/dashboard/DashboardPlayersTab";
import { DashboardRangeSelector } from "@/ui/features/dashboard/DashboardRangeSelector";

const ENABLED_TABS: DashboardTabKey[] = ["overview", "coaches", "players"];
const ALL_TABS: DashboardTabKey[] = [...ENABLED_TABS, "systems"];

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function DashboardTabPage({
  params,
  searchParams,
}: {
  params: Promise<{ tab: string }>;
  searchParams: Promise<{ range?: string | string[] }>;
}) {
  const [{ tab }, resolvedSearchParams, ctx] = await Promise.all([
    params,
    searchParams,
    getAuthContext(),
  ]);

  if (ctx.role !== "admin") {
    if (ctx.role === "player") {
      if (ctx.playerId) {
        redirect(`/players/${ctx.playerId}/overview`);
      }
      redirect("/profile");
    }
    redirect("/players");
  }

  if (!ALL_TABS.includes(tab as DashboardTabKey)) {
    notFound();
  }

  if (tab === "systems") {
    const range = toSingleValue(resolvedSearchParams.range);
    redirect(range ? `/dashboard/overview?range=${range}` : "/dashboard/overview");
  }

  const rangeWindow = getDashboardRangeWindow(toSingleValue(resolvedSearchParams.range));

  if (!ENABLED_TABS.includes(tab as DashboardTabKey)) {
    notFound();
  }

  if (tab === "overview") {
    const data = await getDashboardOverviewData(ctx.facilityId, rangeWindow);
    return (
      <>
        <DashboardRangeSelector selectedKey={rangeWindow.key} />
        <DashboardOverviewTab data={data} />
      </>
    );
  }

  if (tab === "coaches") {
    const data = await getDashboardCoachesData(ctx.facilityId, rangeWindow);
    return (
      <>
        <DashboardRangeSelector selectedKey={rangeWindow.key} />
        <DashboardCoachesTab data={data} />
      </>
    );
  }

  const data = await getDashboardPlayersData(ctx.facilityId, rangeWindow);
  return (
    <>
      <DashboardRangeSelector selectedKey={rangeWindow.key} />
      <DashboardPlayersTab data={data} />
    </>
  );
}


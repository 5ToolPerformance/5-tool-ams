import { getDashboardWeeklyReports } from "@ams/db/queries/dashboard/getDashboardWeeklyReports";
import { DashboardReportsData } from "@ams/domain/dashboard/types";

export async function getDashboardReportsData(
  facilityId: string
): Promise<DashboardReportsData> {
  const reportRows = await getDashboardWeeklyReports(facilityId);

  return {
    reportRows: reportRows.map((row) => ({
      id: row.id,
      status: row.status,
      weekStart: row.reportData.range.weekStart ?? row.weekStart ?? "",
      weekEnd: row.reportData.range.weekEnd ?? row.weekEnd ?? "",
      label: row.reportData.range.label,
      generatedAt: row.generatedAt,
      failedAt: row.failedAt,
      errorMessage: row.errorMessage,
      summary: row.reportData.summary,
      totalCoachesIncluded: row.reportData.coaches.totalCoachesIncluded,
      viewHref: row.status === "complete" ? `/reports/weekly-usage/${row.id}/pdf` : null,
      downloadHref:
        row.status === "complete" ? `/reports/weekly-usage/${row.id}/pdf?download=1` : null,
    })),
  };
}

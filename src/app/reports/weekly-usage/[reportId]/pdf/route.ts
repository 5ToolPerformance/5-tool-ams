import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { getWeeklyUsageReportById } from "@/db/queries/dashboard/getDashboardWeeklyReports";
import { getAuthContext, assertFacilityAccess, requireRole } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { launchPdfBrowser } from "@/application/reports/puppeteer";
import { getWeeklyUsageReportPdfHtml } from "@/application/reports/weeklyUsageReportPdf";

export const runtime = "nodejs";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function getLogoDataUri() {
  const logoPath = path.join(process.cwd(), "public", "logo.svg");
  const svg = await readFile(logoPath, "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ reportId: string }> }
) {
  let browser: Awaited<ReturnType<typeof launchPdfBrowser>> | null = null;

  try {
    const { reportId } = await context.params;
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const report = await getWeeklyUsageReportById(reportId);
    if (!report) {
      return NextResponse.json({ error: "Report unavailable" }, { status: 404 });
    }

    assertFacilityAccess(ctx, report.facilityId);

    if (report.status !== "complete") {
      return NextResponse.json({ error: "Report PDF unavailable" }, { status: 409 });
    }

    const [logoDataUri] = await Promise.all([getLogoDataUri()]);

    browser = await launchPdfBrowser();
    const page = await browser.newPage();

    await page.setContent(
      getWeeklyUsageReportPdfHtml(report.reportData, {
        generatedAt: report.generatedAt,
        logoDataUri,
      }),
      { waitUntil: "load" }
    );

    const pdf = await page.pdf({
      format: "letter",
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      printBackground: true,
      preferCSSPageSize: true,
    });

    const disposition = request.nextUrl.searchParams.get("download") === "1" ? "attachment" : "inline";
    const filename = `weekly-usage-report-${slugify(
      report.reportData.scope.facilityName ?? "facility"
    )}-${slugify(report.reportData.range.label)}.pdf`;

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) {
      return authResponse;
    }

    console.error("Error in GET /reports/weekly-usage/[reportId]/pdf:", error);

    return NextResponse.json(
      { error: "Failed to generate weekly usage report PDF." },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

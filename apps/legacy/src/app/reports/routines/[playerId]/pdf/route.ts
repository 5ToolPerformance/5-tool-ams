import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { getPlayerRoutinesPdfData } from "@/application/players/development/getPlayerRoutinesPdfData";
import { assertPlayerAccess, getAuthContext } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { getPlayerRoutinesPdfHtml } from "@/application/reports/playerRoutinesPdf";
import { parsePlayerRoutinesPdfQuery } from "@/application/reports/playerRoutinesPdfQuery";
import { launchPdfBrowser } from "@/application/reports/puppeteer";

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
  context: { params: Promise<{ playerId: string }> }
) {
  let browser: Awaited<ReturnType<typeof launchPdfBrowser>> | null = null;

  try {
    const { playerId } = await context.params;
    const ctx = await getAuthContext();
    await assertPlayerAccess(ctx, playerId);

    const query = parsePlayerRoutinesPdfQuery({
      discipline: request.nextUrl.searchParams.get("discipline") ?? undefined,
      routineIds: request.nextUrl.searchParams.getAll("routineIds"),
    });

    if (query.routineIds.length === 0) {
      return NextResponse.json(
        { error: "At least one routine must be selected." },
        { status: 400 }
      );
    }

    const [data, logoDataUri] = await Promise.all([
      getPlayerRoutinesPdfData({
        playerId,
        disciplineId: query.disciplineId,
        routineIds: query.routineIds,
      }),
      getLogoDataUri(),
    ]);

    if (!data) {
      return NextResponse.json({ error: "Routine export unavailable" }, { status: 404 });
    }

    browser = await launchPdfBrowser();
    const page = await browser.newPage();
    await page.setContent(getPlayerRoutinesPdfHtml(data, { logoDataUri }), {
      waitUntil: "load",
    });

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

    const filename = `player-routines-${slugify(data.player.name)}-${slugify(
      data.discipline?.label ?? "all-disciplines"
    )}.pdf`;

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) {
      return authResponse;
    }

    console.error("Error in GET /reports/routines/[playerId]/pdf:", error);
    return NextResponse.json(
      { error: "Failed to generate player routines PDF." },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

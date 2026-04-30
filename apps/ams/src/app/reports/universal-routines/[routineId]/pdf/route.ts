import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getUniversalRoutinePdfData } from "@ams/application/routines/getUniversalRoutinePdfData";
import { assertCanReadUniversalRoutine, getAuthContext } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { launchPdfBrowser } from "@ams/application/reports/puppeteer";
import { getUniversalRoutinePdfHtml } from "@ams/application/reports/universalRoutinePdf";

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
  _request: Request,
  context: { params: Promise<{ routineId: string }> }
) {
  let browser: Awaited<ReturnType<typeof launchPdfBrowser>> | null = null;

  try {
    const { routineId } = await context.params;
    const ctx = await getAuthContext();
    await assertCanReadUniversalRoutine(ctx, routineId);

    const [data, logoDataUri] = await Promise.all([
      getUniversalRoutinePdfData(routineId),
      getLogoDataUri(),
    ]);

    if (!data) {
      return NextResponse.json({ error: "Routine export unavailable" }, { status: 404 });
    }

    browser = await launchPdfBrowser();
    const page = await browser.newPage();
    await page.setContent(getUniversalRoutinePdfHtml(data, { logoDataUri }), {
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

    const filename = `universal-routine-${slugify(data.routine.title)}-${slugify(
      data.routine.discipline.label
    )}.pdf`;

    return new NextResponse(Buffer.from(pdf), {
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

    console.error("Error in GET /reports/universal-routines/[routineId]/pdf:", error);
    return NextResponse.json(
      { error: "Failed to generate universal routine PDF." },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

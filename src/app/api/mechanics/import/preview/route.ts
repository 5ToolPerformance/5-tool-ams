// src/app/api/mechanics/import/preview/route.ts
import { NextResponse } from "next/server";

import Papa from "papaparse";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { mechanicImportRowSchema } from "@/lib/schemas/mechanics.schema";

export async function POST(req: Request) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const csvText = await file.text();
    const parsed = Papa.parse(csvText, { header: true });

    const rows = parsed.data.map((row, index) => {
      const result = mechanicImportRowSchema.safeParse(row);

      if (!result.success) {
        return {
          index,
          valid: false,
          errors: result.error.flatten().fieldErrors,
          raw: row,
        };
      }

      return {
        index,
        valid: true,
        data: result.data,
      };
    });

    return NextResponse.json({
      total: rows.length,
      validCount: rows.filter((r) => r.valid).length,
      rows,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to preview mechanics import" }, { status: 500 });
  }
}

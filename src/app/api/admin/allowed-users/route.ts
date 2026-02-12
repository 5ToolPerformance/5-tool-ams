import { NextResponse } from "next/server";

import { z } from "zod";

import db from "@/db";
import { allowedUsers } from "@/db/schema/allowedUsers";
import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { DEFAULT_ORGANIZATION_ID } from "@/lib/constants";

const schema = z.object({
  email: z.string().email(),
  provider: z.enum(["google"]), // keep it google-only in this admin tool for now
  role: z.string().min(1),
  status: z.enum(["invited", "active", "revoked"]).optional(),
});

export async function POST(req: Request) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const organizationId = DEFAULT_ORGANIZATION_ID;

    const email = parsed.data.email.toLowerCase();

    await db.insert(allowedUsers).values({
      email,
      provider: parsed.data.provider,
      role: parsed.data.role,
      status: parsed.data.status ?? "active",
      organizationId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to add allowed user" }, { status: 500 });
  }
}

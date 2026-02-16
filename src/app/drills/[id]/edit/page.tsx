import { notFound, redirect } from "next/navigation";

import { getDrillForEdit } from "@/application/drills/getDrillForEdit";
import {
  assertCanEditDrill,
  AuthError,
  getAuthContext,
} from "@/lib/auth/auth-context";
import { DrillForm } from "@/ui/features/drills/DrillForm";

export default async function EditDrillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await getAuthContext();

  if (ctx.role === "player") {
    if (ctx.playerId) {
      redirect(`/players/${ctx.playerId}/overview`);
    }
    redirect("/profile");
  }

  const { id } = await params;

  try {
    await assertCanEditDrill(ctx, id);
  } catch (error) {
    if (error instanceof AuthError && (error.status === 403 || error.status === 404)) {
      notFound();
    }
    throw error;
  }

  const drill = await getDrillForEdit(id);

  return <DrillForm mode="edit" initialDrill={drill} />;
}

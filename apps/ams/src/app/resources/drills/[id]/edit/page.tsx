import { notFound } from "next/navigation";

import { getDrillForEdit } from "@ams/application/drills/getDrillForEdit";
import {
  assertCanEditDrill,
  AuthError,
  getAuthContext,
} from "@/application/auth/auth-context";
import { DrillForm } from "@/ui/features/drills/DrillForm";

export const dynamic = "force-dynamic";

export default async function EditResourceDrillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await getAuthContext();
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

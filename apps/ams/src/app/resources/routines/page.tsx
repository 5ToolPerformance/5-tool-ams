import { listActiveDisciplines } from "@ams/db/queries/config/listActiveDisciplines";
import { listUniversalRoutines } from "@ams/db/queries/routines/listUniversalRoutines";
import { getAuthContext } from "@/application/auth/auth-context";
import { UniversalRoutinesLibraryPageClient } from "@/ui/features/routines/UniversalRoutinesLibraryPageClient";

export const dynamic = "force-dynamic";

export default async function ResourcesRoutinesPage() {
  const ctx = await getAuthContext();
  const [routines, disciplineOptions] = await Promise.all([
    listUniversalRoutines({
      facilityId: ctx.facilityId,
      includeInactive: ctx.role === "admin",
    }),
    listActiveDisciplines(),
  ]);

  return (
    <UniversalRoutinesLibraryPageClient
      routines={routines}
      disciplineOptions={disciplineOptions}
      viewerRole={ctx.role}
      viewerUserId={ctx.userId}
    />
  );
}

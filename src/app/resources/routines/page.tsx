import { listActiveDisciplines } from "@/db/queries/config/listActiveDisciplines";
import { listUniversalRoutines } from "@/db/queries/routines/listUniversalRoutines";
import { getAuthContext } from "@/lib/auth/auth-context";
import { UniversalRoutinesLibraryPageClient } from "@/ui/features/routines/UniversalRoutinesLibraryPageClient";

export default async function ResourcesRoutinesPage() {
  const ctx = await getAuthContext();
  const [routines, disciplineOptions] = await Promise.all([
    listUniversalRoutines({ facilityId: ctx.facilityId }),
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

import { getLessonForEdit } from "@/application/lessons/getLessonForEdit";
import { getLessonRoutineOptions } from "@/application/lessons/routines";
import db from "@/db";
import { getDrillsForLessonForm } from "@/db/queries/drills/getDrillsForLessonForm";
import { getInjuryBodyParts } from "@/db/queries/injuryTaxonomy/getInjuryBodyParts";
import { hydrateLessonForm } from "@/domain/lessons/hydrate";
import { env } from "@/env/server";
import { getAuthContext } from "@/application/auth/auth-context";
import { createMechanic, deleteMechanic, listMechanics, listMechanicsForLessonForm, updateMechanic } from "@/db/queries/mechanics/mechanicsRepository";
import { createPlayerInjury, getPlayerInjuriesByPlayerId, listPlayersForLessonForm, listPlayersForLessonFormScoped, updatePlayerInjury } from "@/db/queries/players/playerInjuryAndLessonFormQueries";
import { DebugFormState } from "@/ui/features/lesson-form/DebugFormState";
import { LessonFormProvider } from "@/ui/features/lesson-form/LessonFormProvider";
import { LessonStepper } from "@/ui/features/lesson-form/LessonStepper";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const players = await listPlayersForLessonForm();
  const mechanics = await listMechanicsForLessonForm();
  const drills = await getDrillsForLessonForm(db);
  const bodyParts = await getInjuryBodyParts(db);
  const { id } = await params;
  const readModel = await getLessonForEdit(id);
  const defaultValues = hydrateLessonForm(readModel);
  const ctx = await getAuthContext();
  const routines = await getLessonRoutineOptions({
    playerIds: players.map((player) => player.id),
    facilityId: ctx.facilityId,
  });

  return (
    <LessonFormProvider
      players={players}
      mechanics={mechanics}
      drills={drills}
      routines={routines}
      bodyParts={bodyParts}
      mode="edit"
      lessonId={id}
      defaultValues={defaultValues}
    >
      <LessonStepper />
      {env.NODE_ENV === "development" && <DebugFormState />}
    </LessonFormProvider>
  );
}

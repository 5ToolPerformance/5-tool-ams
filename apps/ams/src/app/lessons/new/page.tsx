import { getLessonRoutineOptions } from "@ams/application/lessons/routines";
import db from "@ams/db";
import { getDrillsForLessonForm } from "@ams/db/queries/drills/getDrillsForLessonForm";
import { getInjuryBodyParts } from "@ams/db/queries/injuryTaxonomy/getInjuryBodyParts";
import { env } from "@/env/server";
import { getAuthContext } from "@/application/auth/auth-context";
import { createMechanic, deleteMechanic, listMechanics, listMechanicsForLessonForm, updateMechanic } from "@ams/db/queries/mechanics/mechanicsRepository";
import { createPlayerInjury, getPlayerInjuriesByPlayerId, listPlayersForLessonForm, listPlayersForLessonFormScoped, updatePlayerInjury } from "@ams/db/queries/players/playerInjuryAndLessonFormQueries";
import { DebugFormState } from "@/ui/features/lesson-form/DebugFormState";
import { LessonFormProvider } from "@/ui/features/lesson-form/LessonFormProvider";
import { LessonStepper } from "@/ui/features/lesson-form/LessonStepper";

export default async function NewLessonPage({
  searchParams,
}: {
  searchParams: Promise<{ playerId?: string }>;
}) {
  const players = await listPlayersForLessonForm();
  const mechanics = await listMechanicsForLessonForm();
  const drills = await getDrillsForLessonForm(db);
  const bodyParts = await getInjuryBodyParts(db);
  const { playerId } = await searchParams;
  const ctx = await getAuthContext();
  const routines = await getLessonRoutineOptions({
    playerIds: players.map((player) => player.id),
    facilityId: ctx.facilityId,
  });

  return (
    <LessonFormProvider
      bodyParts={bodyParts}
      players={players}
      mechanics={mechanics}
      drills={drills}
      routines={routines}
      initialPlayerId={playerId}
    >
      <LessonStepper />
      {env.NODE_ENV === "development" && <DebugFormState />}
    </LessonFormProvider>
  );
}

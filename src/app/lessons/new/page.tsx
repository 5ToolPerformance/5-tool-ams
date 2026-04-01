import { getLessonRoutineOptions } from "@/application/lessons/routines";
import db from "@/db";
import { getDrillsForLessonForm } from "@/db/queries/drills/getDrillsForLessonForm";
import { getInjuryBodyParts } from "@/db/queries/injuryTaxonomy/getInjuryBodyParts";
import { env } from "@/env/server";
import { getAuthContext } from "@/lib/auth/auth-context";
import { mechanicsRepository } from "@/lib/services/repository/mechanics";
import { playerRepository } from "@/lib/services/repository/players";
import { DebugFormState } from "@/ui/features/lesson-form/DebugFormState";
import { LessonFormProvider } from "@/ui/features/lesson-form/LessonFormProvider";
import { LessonStepper } from "@/ui/features/lesson-form/LessonStepper";

export default async function NewLessonPage({
  searchParams,
}: {
  searchParams: Promise<{ playerId?: string }>;
}) {
  const players = await playerRepository.findPlayersForLessonForm();
  const mechanics = await mechanicsRepository.findAllForLessonForm();
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

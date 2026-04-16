import { notFound } from "next/navigation";

import { Button } from "@heroui/react";

import { auth } from "@/auth";
import LessonCountSelector from "@/components/LessonCountSelector";
import WriteupChecklist from "@/components/WriteupChecklist";
import PlayerProfileCard from "@/components/players/playerCard";
import { createLesson, deleteLessonById, getLastLessonsByPlayer, getLessonAssessmentById, getLessonById, getNumberOfLessonsByPlayer, getWriteupsByPlayer, validateLessonData } from "@/application/lessons/lessonFunctions";
import { createMotorPreferences, createPlayerInformation, getAllPlayersWithInformationScoped, getMotorPreferencesById, getPlayerById, getPlayerByIdScoped, getPlayerInformationById } from "@/application/players/playerFunctions";
import { PageProps } from "@/types/page";

type PlayerPageProps = PageProps<{ id: string }>;

export default async function PlayerReportPage({
  params,
  searchParams,
}: PlayerPageProps) {
  const session = await auth();
  if (!session) return notFound();

  const { id } = await params;

  const sp = await searchParams;
  const maybeCount = Array.isArray(sp.count) ? sp.count[0] : sp.count;
  const parsed = maybeCount ? parseInt(maybeCount, 10) : NaN;
  const allowed = [5, 10, 20];
  const count = allowed.includes(parsed) ? parsed : 10;

  const player = await getPlayerById(id);
  if (!player) return notFound();
  const lessons = await getLastLessonsByPlayer(id, count);
  const writeups = await getWriteupsByPlayer(id);

  // Determine if checklist is complete: every lesson type has a writeup
  const lessonTypes = new Set(lessons.map((l) => l.lessonType));
  const writeupTypes = new Set(writeups.map((w) => w.writeupType));
  const isChecklistComplete = Array.from(lessonTypes).every((t) =>
    writeupTypes.has(t)
  );

  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-6">
      <PlayerProfileCard player={player} className="w-full" size="sm" />

      <div className="mt-4">
        <LessonCountSelector count={count} fullWidth />
      </div>

      <div className="mt-4">
        <WriteupChecklist lessons={lessons} writeups={writeups} />
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button
          color={isChecklistComplete ? "primary" : "default"}
          isDisabled={!isChecklistComplete}
          size="sm"
        >
          Create Report
        </Button>
      </div>
    </div>
  );
}

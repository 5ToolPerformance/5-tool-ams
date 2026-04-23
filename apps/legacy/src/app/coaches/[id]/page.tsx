import { notFound } from "next/navigation";

import { auth } from "@/auth";
import CoachProfile from "@/ui/features/coaches/CoachProfile";
import { getLessonsByCoachId } from "@/db/queries/lessons/lessonQueries";
import { findCoachPlayerLessonCounts, getAvgSubmissionTime } from "@/db/queries/coaches/coachRepository";
import { getAllCoachesScoped, getAllUsersScoped, getUserById, getUserByIdScoped } from "@/application/users/userFunctions";
import { PageProps } from "@/types/page";

type CoachPageProps = PageProps<{ id: string }>;

export default async function CoachPage({ params }: CoachPageProps) {
  const session = await auth();
  if (!session) return notFound();

  const { id } = await params;
  const coach = await getUserById(id);
  if (!coach) return notFound();

  const avgTime = await getAvgSubmissionTime(id);

  const coachLessons = await getLessonsByCoachId(id);

  return <CoachProfile coachId={coach.id} avgTime={avgTime} lessonData={coachLessons} />;
}

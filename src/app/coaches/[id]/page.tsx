import { notFound } from "next/navigation";

import { auth } from "@/auth";
import CoachProfile from "@/components/coach-profile";
import { getLessonsByCoachId } from "@/db/queries/lessons/lessonQueries";
import { coachRepository } from "@/lib/services/repository/coaches";
import { UserService } from "@/lib/services/users";
import { PageProps } from "@/types/page";

type CoachPageProps = PageProps<{ id: string }>;

export default async function CoachPage({ params }: CoachPageProps) {
  const session = await auth();
  if (!session) return notFound();

  const { id } = await params;
  const coach = await UserService.getUserById(id);
  if (!coach) return notFound();

  const avgTime = await coachRepository.getAvgSubmissionTime(id);

  const coachLessons = await getLessonsByCoachId(id);

  return <CoachProfile coachId={coach.id} avgTime={avgTime} lessonData={coachLessons} />;
}

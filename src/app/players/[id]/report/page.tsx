import { notFound } from "next/navigation";

import { auth } from "@/auth";
import WriteupChecklist from "@/components/WriteupChecklist";
import { LessonService } from "@/lib/services/lessons";
import { PlayerService } from "@/lib/services/players";
import { PageProps } from "@/types/page";

type PlayerPageProps = PageProps<{ id: string }>;

export default async function PlayerReportPage({ params }: PlayerPageProps) {
  const session = await auth();
  if (!session) return notFound();

  let coachId: string | undefined = undefined;
  if (session.user.role === "coach") {
    coachId = session.user.id;
  }
  const { id } = await params;
  const player = await PlayerService.getPlayerById(id);
  if (!player) return notFound();
  const lessons = await LessonService.getLastLessonsByPlayer(id, 10);
  const dummyWriteups = [];

  return <WriteupChecklist lessons={lessons} writeups={dummyWriteups} />;
}

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getAllLessonsForPlayer } from "@/db/queries/lessons/lessonQueries";
import { InteractiveLessonList } from "@/ui/features/lessons/lessonCard";
import requireAuth from "@/utils/require-auth";

export default async function TestPage() {
  await requireAuth();
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role === "player") {
    redirect("/");
  }
  const userId = session.user.id;

  // All lessons a player participated in (including group lessons)
  const allForPlayer = await getAllLessonsForPlayer(
    "88d8c6a6-5b7d-493f-b39c-14f9f26e4dea"
  );

  return (
    <InteractiveLessonList
      lessons={allForPlayer}
      viewContext="player"
      baseHref="/lessons"
      emptyMessage="No lessons found for this player"
    />
  );
}

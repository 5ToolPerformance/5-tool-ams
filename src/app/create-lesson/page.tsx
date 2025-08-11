import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LessonCreationForm from "@/components/lesson-form/test-lesson-form";
import requireAuth from "@/utils/require-auth";

export default async function CreateLessonPage() {
  await requireAuth();
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role === "player") {
    redirect("/");
  }
  const userId = session.user.id;

  return <LessonCreationForm coachId={userId} />;
}

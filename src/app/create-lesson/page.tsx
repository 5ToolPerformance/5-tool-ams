import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ModularLessonForm from "@/components/forms";
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

  return <ModularLessonForm coachId={userId} />;
}

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import LessonCreationForm from "@/components/lesson-form/test-lesson-form";
import options from "@/config/auth";
import requireAuth from "@/utils/require-auth";

export default async function CreateLessonPage() {
  await requireAuth();
  const session = await getServerSession(options);

  if (!session?.user) {
    redirect("/");
  }

  return <LessonCreationForm />;
}

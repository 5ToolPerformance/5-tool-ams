import { getLessonForEdit } from "@/application/lessons/getLessonForEdit";
import { hydrateLessonForm } from "@/domain/lessons/hydrate";
import { env } from "@/env/server";
import { mechanicsRepository } from "@/lib/services/repository/mechanics";
import { playerRepository } from "@/lib/services/repository/players";
import { DebugFormState } from "@/ui/features/lesson-form/DebugFormState";
import { LessonFormProvider } from "@/ui/features/lesson-form/LessonFormProvider";
import { LessonStepper } from "@/ui/features/lesson-form/LessonStepper";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const players = await playerRepository.findPlayersForLessonForm();
  const mechanics = await mechanicsRepository.findAllForLessonForm();
  const { id } = await params;
  const readModel = await getLessonForEdit(id);
  const defaultValues = hydrateLessonForm(readModel);

  return (
    <LessonFormProvider
      players={players}
      mechanics={mechanics}
      mode="edit"
      lessonId={id}
      defaultValues={defaultValues}
    >
      <LessonStepper />
      {env.NODE_ENV === "development" && <DebugFormState />}
    </LessonFormProvider>
  );
}

import { playerRepository } from "@/lib/services/repository/players";
import { DebugFormState } from "@/ui/features/lesson-form/DebugFormState";
import { LessonFormProvider } from "@/ui/features/lesson-form/LessonFormProvider";
import { LessonStepper } from "@/ui/features/lesson-form/LessonStepper";

export default async function NewLessonPage() {
  const players = await playerRepository.findPlayersForLessonForm();

  return (
    <LessonFormProvider players={players}>
      <LessonStepper players={players} />
      <DebugFormState />
    </LessonFormProvider>
  );
}

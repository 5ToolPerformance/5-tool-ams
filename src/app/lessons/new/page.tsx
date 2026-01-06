import { mechanicsRepository } from "@/lib/services/repository/mechanics";
import { playerRepository } from "@/lib/services/repository/players";
import { DebugFormState } from "@/ui/features/lesson-form/DebugFormState";
import { LessonFormProvider } from "@/ui/features/lesson-form/LessonFormProvider";
import { LessonStepper } from "@/ui/features/lesson-form/LessonStepper";

export default async function NewLessonPage() {
  const players = await playerRepository.findPlayersForLessonForm();
  const mechanics = await mechanicsRepository.findAllForLessonForm();

  return (
    <LessonFormProvider players={players} mechanics={mechanics}>
      <LessonStepper />
      <DebugFormState />
    </LessonFormProvider>
  );
}

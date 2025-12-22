import { DebugFormState } from "@/ui/features/lesson-form/DebugFormState";
import { LessonFormProvider } from "@/ui/features/lesson-form/LessonFormProvider";
import { LessonStepper } from "@/ui/features/lesson-form/LessonStepper";

export default function NewLessonPage() {
  return (
    <LessonFormProvider>
      <LessonStepper />
      <DebugFormState />
    </LessonFormProvider>
  );
}

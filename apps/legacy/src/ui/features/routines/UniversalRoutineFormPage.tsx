"use client";

import { useRouter } from "next/navigation";

import type { RoutineFormConfig } from "@/application/routines/getRoutineFormConfig";
import type { RoutineFormRecord } from "@/ui/features/development/forms/routines/routineForm.types";
import { RoutineForm } from "@/ui/features/development/forms/routines/RoutineForm";
import { RoutineFormProvider } from "@/ui/features/development/forms/routines/RoutineFormProvider";

type UniversalRoutineFormPageProps = {
  createdBy: string;
  config: Pick<
    RoutineFormConfig,
    "disciplineOptions" | "mechanicOptions" | "drillOptions"
  >;
  initialRoutine?: RoutineFormRecord | null;
};

export function UniversalRoutineFormPage({
  createdBy,
  config,
  initialRoutine = null,
}: UniversalRoutineFormPageProps) {
  const router = useRouter();

  return (
    <RoutineFormProvider
      mode={initialRoutine ? "edit" : "create"}
      contextType="universal"
      createdBy={createdBy}
      disciplineOptions={config.disciplineOptions}
      mechanicOptions={config.mechanicOptions}
      drillOptions={config.drillOptions}
      initialRoutine={initialRoutine}
      onSaved={() => router.push("/resources/routines")}
    >
      <RoutineForm onCancel={() => router.push("/resources/routines")} />
    </RoutineFormProvider>
  );
}

import { useRouter } from "next/navigation";

import { useForm } from "@tanstack/react-form";

import { getCompleteLessonDefaults } from "@/lib/form-defaults";
import { ApiResponse } from "@/types/api";
import { LessonCreateData } from "@/types/lessons";

const router = useRouter();

const form = useForm({
  defaultValues: getCompleteLessonDefaults(""),
  onSubmit: async ({ value }) => {
    const completeData = value as LessonCreateData;
    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      const result: ApiResponse<LessonCreateData> = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create lesson");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
    alert("Lesson created successfully! Check console for data.");
  },
});

export type MultiStepFormType = typeof form;

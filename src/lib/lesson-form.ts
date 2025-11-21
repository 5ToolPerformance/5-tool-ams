import { useForm } from "@tanstack/react-form";

export type AssessmentJoinType = {
  id: string;
  lessonId: string;
  assessmentType: string;
  assessmentId: string;
  assessmentDate: string;
};

export type MechanicType = {
  id: string;
  name: string;
  notes: string;
};

export type MuscleGroupType = {
  id: string;
  name: string;
  notes: string;
};

export type LessonFormData = {
  basicInfo: {
    playerId: string;
    coachId: string;
    lessonDate: string;
    lessonType: string;
  };
  assessmentJoins: AssessmentJoinType[];
  lessonInformation: {
    disciplines: string[];
    mechanics: MechanicType[];
    muscleGroups: MuscleGroupType[];
  };
  generalNotes: string;
};

const LessonFormDefaults: LessonFormData = {
  basicInfo: {
    playerId: "",
    coachId: "",
    lessonDate: "",
    lessonType: "",
  },
  assessmentJoins: [],
  lessonInformation: {
    disciplines: [],
    mechanics: [],
    muscleGroups: [],
  },
  generalNotes: "",
};

export function useLessonForm() {
  return useForm({
    defaultValues: LessonFormDefaults,
    onSubmit: async (values) => {
      try {
        console.log(values);
      } catch (error) {
        console.error(error);
      }
    },
  });
}

export type LessonFormType = ReturnType<typeof useLessonForm>;

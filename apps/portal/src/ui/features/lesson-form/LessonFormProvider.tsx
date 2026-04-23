"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import type { LessonType } from "@/hooks/lessons/lessonForm.types";
import { LessonFormValues } from "@/hooks/lessons/lessonForm.types";
import type { LessonRoutineOption } from "@/hooks/lessons/lessonRoutineOptions";
import { useLessonForm } from "@/hooks/lessons/useLessonForm";
import {
  EvidenceUploadDraft,
  EvidenceUploadSource,
} from "@/ui/features/lesson-form/components/EvidenceUploadSection";

export type LessonFormPlayer = {
  id: string;
  firstName: string;
  lastName: string;
};

export type LessonFormMechanic = {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  tags: string[] | null;
};

export type LessonFormBodyPart = {
  id: string;
  name: string;
};

export type LessonFormDrill = {
  id: string;
  title: string;
  description: string | null;
  discipline: string;
};

export type LessonFormRoutine = LessonRoutineOption;

type LessonFormContextValue = ReturnType<typeof useLessonForm> & {
  players: LessonFormPlayer[];
  playerById: Record<string, string>;

  mechanics: LessonFormMechanic[];
  mechanicById: Record<string, LessonFormMechanic>;

  bodyParts: LessonFormBodyPart[];

  drills: LessonFormDrill[];
  drillsById: Record<string, LessonFormDrill>;

  routines: LessonFormRoutine[];
  routinesByKey: Record<string, LessonFormRoutine>;
  getAvailableRoutines: (playerId: string, lessonType?: LessonType) => LessonFormRoutine[];
  toggleRoutineSelection: (playerId: string, routine: LessonFormRoutine) => void;

  evidenceDrafts: Record<string, EvidenceUploadDraft>;
  setEvidenceDrafts: React.Dispatch<
    React.SetStateAction<Record<string, EvidenceUploadDraft>>
  >;
  isSubmitLocked: boolean;
  submitWithUploads: () => Promise<void>;
};

const LessonFormContext = createContext<LessonFormContextValue | null>(null);

export function useLessonFormContext() {
  const context = useContext(LessonFormContext);
  if (!context) {
    throw new Error(
      "useLessonFormContext must be used within LessonFormProvider"
    );
  }
  return context;
}

type LessonFormProviderProps = {
  mode?: "create" | "edit";
  lessonId?: string;
  defaultValues?: LessonFormValues;
  players: LessonFormPlayer[];
  mechanics: LessonFormMechanic[];
  bodyParts: LessonFormBodyPart[];
  drills: LessonFormDrill[];
  routines?: LessonFormRoutine[];
  children: React.ReactNode;
  initialPlayerId?: string;
};

export function LessonFormProvider({
  mode = "create",
  lessonId,
  defaultValues,
  bodyParts = [],
  players = [],
  mechanics = [],
  drills = [],
  routines = [],
  children,
  initialPlayerId,
}: LessonFormProviderProps) {
  const lessonForm = useLessonForm({ mode, lessonId, defaultValues });
  const { form, ensurePlayers } = lessonForm;
  const [evidenceDrafts, setEvidenceDrafts] = useState<
    Record<string, EvidenceUploadDraft>
  >({});
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);

  useEffect(() => {
    if (!initialPlayerId) return;

    form.setFieldValue("selectedPlayerIds", [initialPlayerId]);

    ensurePlayers([initialPlayerId]);
  }, [initialPlayerId]);

  const playerById = useMemo(() => {
    return Object.fromEntries(
      players.map((p) => [p.id, `${p.firstName} ${p.lastName}`])
    );
  }, [players]);

  const mechanicById = useMemo(() => {
    return Object.fromEntries(mechanics.map((m) => [m.id, m]));
  }, [mechanics]);

  const drillsById = useMemo(() => {
    return Object.fromEntries(drills.map((d) => [d.id, d]));
  }, [drills]);

  const routinesByKey = useMemo(() => {
    return Object.fromEntries(routines.map((routine) => [routine.key, routine]));
  }, [routines]);

  function getAvailableRoutines(playerId: string, lessonType?: LessonType) {
    return routines.filter((routine) => {
      if (lessonType && routine.disciplineKey !== lessonType) {
        return false;
      }

      return routine.playerId === null || routine.playerId === playerId;
    });
  }

  function toggleRoutineSelection(playerId: string, routine: LessonFormRoutine) {
    const selections = form.getFieldValue(`players.${playerId}.routineSelections`) ?? [];
    const isSelected = selections.some(
      (selection) =>
        selection.source === routine.source && selection.routineId === routine.routineId
    );

    if (isSelected) {
      form.setFieldValue(
        `players.${playerId}.routineSelections`,
        selections.filter(
          (selection) =>
            !(
              selection.source === routine.source &&
              selection.routineId === routine.routineId
            )
        )
      );
      return;
    }

    const hasFullRoutine = selections.some(
      (selection) => selection.routineType === "full_lesson"
    );
    const hasPartialRoutine = selections.some(
      (selection) => selection.routineType === "partial_lesson"
    );

    if (routine.routineType === "full_lesson" && hasPartialRoutine) {
      toast.error("Full lesson routines cannot be mixed with partial lesson routines.");
      return;
    }

    if (routine.routineType === "partial_lesson" && hasFullRoutine) {
      toast.error("Partial lesson routines cannot be mixed with a full lesson routine.");
      return;
    }

    if (routine.routineType === "full_lesson" && hasFullRoutine) {
      toast.error("Only one full lesson routine can be applied per player.");
      return;
    }

    const nextSelections = [
      ...selections,
      {
        source: routine.source,
        routineId: routine.routineId,
        routineType: routine.routineType,
        title: routine.title,
      },
    ];

    form.setFieldValue(`players.${playerId}.routineSelections`, nextSelections);

    const mechanicMap = {
      ...(form.getFieldValue(`players.${playerId}.mechanics`) ?? {}),
    };
    for (const mechanic of routine.document.mechanics) {
      mechanicMap[mechanic.mechanicId] = mechanicMap[mechanic.mechanicId] ?? {};
    }
    form.setFieldValue(`players.${playerId}.mechanics`, mechanicMap);

    const drillMap = {
      ...(form.getFieldValue(`players.${playerId}.drills`) ?? {}),
    };
    for (const block of routine.document.blocks) {
      for (const drill of block.drills) {
        drillMap[drill.drillId] = drillMap[drill.drillId] ?? {};
      }
    }
    form.setFieldValue(`players.${playerId}.drills`, drillMap);
  }

  function inferAttachmentType(
    source: EvidenceUploadSource,
    file?: File | null
  ) {
    if (source !== "media") return "file_csv";
    if (file?.type?.startsWith("image/")) return "file_image";
    return "file_video";
  }

  function inferMediaSource(lessonType?: LessonType) {
    return lessonType ?? "hitting";
  }

  async function uploadEvidenceDrafts(
    lessonPlayerByPlayerId?: Record<string, string>
  ) {
    const drafts = Object.entries(evidenceDrafts).filter(([, draft]) =>
      draft.items.some((item) => !!item.file)
    );

    if (drafts.length === 0) return;

    const results = await Promise.allSettled(
      drafts.flatMap(([playerId, draft]) => {
        return draft.items
          .filter((item) => !!item.file)
          .map(async (item) => {
            const lessonPlayerId =
              lessonPlayerByPlayerId?.[playerId] ??
              form.getFieldValue(`players.${playerId}.lessonPlayerId`);

            if (!lessonPlayerId) {
              throw new Error(`Missing lessonPlayerId for ${playerId}`);
            }

            const formData = new FormData();
            formData.append("file", item.file as File);
            formData.append("athleteId", playerId);
            formData.append("lessonPlayerId", lessonPlayerId);
            const attachmentType = inferAttachmentType(item.source, item.file);
            formData.append("type", attachmentType);

            if (item.source === "media") {
              if (!form.state.values.lessonType) {
                throw new Error("Media uploads require a lesson type");
              }
              formData.append(
                "source",
                inferMediaSource(form.state.values.lessonType)
              );
              formData.append("evidenceCategory", "media");
            } else {
              formData.append("source", item.source);
              formData.append("evidenceCategory", "performance");
            }

            if (item.notes.trim()) {
              formData.append("notes", item.notes);
            }

            const res = await fetch("/api/attachments/upload", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              const data = await res.json().catch(() => null);
              throw new Error(data?.error ?? "Upload failed");
            }
          });
      })
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      toast.error(
        `${failed.length} upload${failed.length === 1 ? "" : "s"} failed`
      );
      return;
    }

    const totalFiles = drafts.reduce(
      (count, [, draft]) =>
        count + draft.items.filter((item) => !!item.file).length,
      0
    );
    toast.success(
      `${totalFiles} upload${totalFiles === 1 ? "" : "s"} completed`
    );
    setEvidenceDrafts({});
  }

  async function submitWithUploads() {
    if (isSubmitLocked) return;
    setIsSubmitLocked(true);

    try {
      const result = await lessonForm.submit();

      if (!result) return;

      if (result.mode === "create") {
        await uploadEvidenceDrafts(result.lessonPlayerByPlayerId);
      } else {
        await uploadEvidenceDrafts();
      }

      lessonForm.completeSuccess();
    } finally {
      setIsSubmitLocked(false);
    }
  }

  return (
    <LessonFormContext.Provider
      value={{
        ...lessonForm,

        players,
        playerById,

        mechanics,
        mechanicById,

        bodyParts,

        drills,
        drillsById,
        routines,
        routinesByKey,
        getAvailableRoutines,
        toggleRoutineSelection,

        evidenceDrafts,
        setEvidenceDrafts,
        isSubmitLocked,
        submitWithUploads,
      }}
    >
      <form.Subscribe selector={(state) => state.values}>
        {() => children}
      </form.Subscribe>
    </LessonFormContext.Provider>
  );
}

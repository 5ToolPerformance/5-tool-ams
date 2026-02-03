"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { LessonFormValues } from "@/hooks/lessons/lessonForm.types";
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

type LessonFormContextValue = ReturnType<typeof useLessonForm> & {
  players: LessonFormPlayer[];
  playerById: Record<string, string>;

  mechanics: LessonFormMechanic[];
  mechanicById: Record<string, LessonFormMechanic>;

  evidenceDrafts: Record<string, EvidenceUploadDraft>;
  setEvidenceDrafts: React.Dispatch<
    React.SetStateAction<Record<string, EvidenceUploadDraft>>
  >;
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
  children: React.ReactNode;
  initialPlayerId?: string;
};

export function LessonFormProvider({
  mode = "create",
  lessonId,
  defaultValues,
  players = [],
  mechanics = [],
  children,
  initialPlayerId,
}: LessonFormProviderProps) {
  const lessonForm = useLessonForm({ mode, lessonId, defaultValues });
  const { form, ensurePlayers } = lessonForm;
  const [evidenceDrafts, setEvidenceDrafts] = useState<
    Record<string, EvidenceUploadDraft>
  >({});

  useEffect(() => {
    if (!initialPlayerId) return;

    form.setFieldValue("selectedPlayerIds", [
      initialPlayerId,
    ]);

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

  function inferAttachmentType(source: EvidenceUploadSource) {
    return source === "video" ? "file_video" : "file_csv";
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
          formData.append("type", inferAttachmentType(item.source));
          formData.append("source", item.source);
          formData.append("evidenceCategory", "performance");

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
    const result = await lessonForm.submit();

    if (!result) return;

    if (result.mode === "create") {
      await uploadEvidenceDrafts(result.lessonPlayerByPlayerId);
    } else {
      await uploadEvidenceDrafts();
    }

    lessonForm.completeSuccess();
  }

  return (
    <LessonFormContext.Provider
      value={{
        ...lessonForm,

        players,
        playerById,

        mechanics,
        mechanicById,

        evidenceDrafts,
        setEvidenceDrafts,
        submitWithUploads,
      }}
    >
      <form.Subscribe selector={(state) => state.values}>
        {() => children}
      </form.Subscribe>
    </LessonFormContext.Provider>
  );
}

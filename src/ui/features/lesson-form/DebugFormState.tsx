"use client";

import { hydrateLessonForm } from "@/domain/lessons/hydrate";
import {
  LessonWritePayload,
  normalizeLessonForCreate,
} from "@/domain/lessons/normalize";
import { LessonFormValues } from "@/hooks/lessons/lessonForm.types";

import { useLessonFormContext } from "./LessonFormProvider";

function DebugBlock({ title, data }: { title: string; data: unknown }) {
  return (
    <div
      style={{
        border: "1px solid #333",
        padding: 12,
        background: "#111",
        color: "#0f0",
        fontSize: 12,
        overflow: "auto",
        maxHeight: 400,
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: 8,
          color: "#9f9",
        }}
      >
        {title}
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export function DebugFormState() {
  const { form, step } = useLessonFormContext();

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => {
        let normalized: LessonWritePayload | null = null;
        let rehydrated: LessonFormValues | null = null;
        let error: string | null = null;

        try {
          normalized = normalizeLessonForCreate(values);

          // Build a minimal read model to test hydration
          rehydrated = hydrateLessonForm({
            lesson: {
              id: "__debug__",
              date: normalized.lesson.date,
              type: normalized.lesson.type,
              sharedNotes: normalized.lesson.sharedNotes,
            },
            participants: normalized.participants,
            mechanics: normalized.mechanics,
          });
        } catch (e) {
          error =
            e instanceof Error ? e.message : "Unknown normalization error";
        }

        return (
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            <DebugBlock
              title={`Form Values (step: ${step.current})`}
              data={values}
            />

            <DebugBlock title="Normalized Payload" data={normalized} />

            <DebugBlock title="Rehydrated Values" data={rehydrated} />

            {error && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: 12,
                  background: "#300",
                  color: "#f88",
                  fontSize: 12,
                  border: "1px solid #600",
                }}
              >
                <strong>Normalization Error:</strong> {error}
              </div>
            )}
          </div>
        );
      }}
    </form.Subscribe>
  );
}

"use client";

import { useEffect } from "react";

import { Card, CardBody, Textarea } from "@heroui/react";

import { useLessonFormContext } from "../LessonFormProvider";

export function StepSharedNotes() {
  const { form, ensureSharedNotes } = useLessonFormContext();

  // ✅ Ensure structure AFTER render, not during
  useEffect(() => {
    ensureSharedNotes();
  }, [ensureSharedNotes]);

  return (
    <form.Subscribe selector={(state) => state.values.sharedNotes}>
      {(sharedNotes) => {
        const general = sharedNotes?.general ?? "";

        return (
          <Card shadow="sm">
            <CardBody className="space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-lg font-semibold">Shared Lesson Notes</h2>
                <p className="text-sm text-foreground-500">
                  These notes apply to the lesson as a whole and are shared
                  across all players.
                </p>
              </div>

              {/* Notes */}
              <Textarea
                label="General Notes"
                placeholder="Notes that apply to the entire lesson…"
                minRows={4}
                value={general}
                onChange={(e) =>
                  form.setFieldValue("sharedNotes.general", e.target.value)
                }
              />
            </CardBody>
          </Card>
        );
      }}
    </form.Subscribe>
  );
}

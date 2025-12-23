"use client";

import { useEffect } from "react";

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
        const drills = sharedNotes?.drills ?? "";

        function updateGeneral(e: React.ChangeEvent<HTMLTextAreaElement>) {
          form.setFieldValue("sharedNotes.general", e.target.value);
        }

        function updateDrills(e: React.ChangeEvent<HTMLTextAreaElement>) {
          form.setFieldValue("sharedNotes.drills", e.target.value);
        }

        return (
          <div>
            <h2>Shared Lesson Notes</h2>

            <div style={{ marginBottom: 16 }}>
              <label>
                General Notes
                <textarea
                  value={general}
                  onChange={updateGeneral}
                  rows={4}
                  style={{ width: "100%" }}
                />
              </label>
            </div>

            <div>
              <label>
                Drills / Focus
                <textarea
                  value={drills}
                  onChange={updateDrills}
                  rows={4}
                  style={{ width: "100%" }}
                />
              </label>
            </div>
          </div>
        );
      }}
    </form.Subscribe>
  );
}

"use client";

import { useLessonFormContext } from "./LessonFormProvider";

export function DebugFormState() {
  const { form, step, mechanics } = useLessonFormContext();

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => (
        <pre
          style={{
            marginTop: 24,
            padding: 12,
            background: "#111",
            color: "#0f0",
            fontSize: 12,
            overflow: "auto",
          }}
        >
          {JSON.stringify(
            {
              step: step.current,
              values,
              mechanics,
            },
            null,
            2
          )}
        </pre>
      )}
    </form.Subscribe>
  );
}

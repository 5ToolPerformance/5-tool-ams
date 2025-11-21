"use client";

import { useState } from "react";

import { Button, Input, Select, SelectItem } from "@heroui/react";

import { useLessonForm } from "@/lib/lesson-form";

import { MechanicPicker } from "./MechanicPicker";

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const form = useLessonForm();

  return (
    <div className="flex w-[400px] flex-col gap-4 p-4">
      <form onSubmit={form.handleSubmit}>
        {step === 0 ? (
          <div>
            {" "}
            <form.Field name="basicInfo.playerId">
              {(field) => (
                <Input
                  type="text"
                  label="Player ID"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="basicInfo.coachId">
              {(field) => (
                <Input
                  type="text"
                  label="Coach ID"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="basicInfo.lessonDate">
              {(field) => (
                <Input
                  type="date"
                  label="Lesson Date"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="basicInfo.lessonType">
              {(field) => (
                <Select
                  label="Lesson Type"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                >
                  <SelectItem key="pitching">Pitching</SelectItem>
                  <SelectItem key="fielding">Fielding</SelectItem>
                  <SelectItem key="hitting">Hitting</SelectItem>
                </Select>
              )}
            </form.Field>
          </div>
        ) : null}
        {step === 1 ? (
          <MechanicPicker discipline={form.state.values.basicInfo.lessonType} />
        ) : null}
        <Button onPress={() => setStep(step + 1)}>Next</Button>
        <Button onPress={() => setStep(step - 1)}>Previous</Button>
      </form>
    </div>
  );
}

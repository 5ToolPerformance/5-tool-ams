"use client";

import React from "react";

import { Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";

import DecimalNumberInput from "../ui/DecimalNumberInput";

const PITCH_TYPES = [
  { value: "tee", label: "Tee" },
  { value: "flips", label: "Flips" },
  { value: "overhand", label: "Overhand" },
  { value: "machine", label: "Machine" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { form: any };

const HitTraxAssessmentForm: React.FC<Props> = ({ form }) => (
  <Card className="mb-1 rounded-lg border border-orange-200 bg-default p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-orange-900 dark:text-orange-100">
        HitTrax Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <form.Field name="hitTraxAssessment.pitchType">
        {(field: any) => (
          <Select
            label="Pitch Type"
            placeholder="Select pitch type"
            selectedKeys={[field.state.value]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              field.handleChange(selectedKey);
            }}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors.join(", ")}
            isRequired
          >
            {PITCH_TYPES.map((type) => (
              <SelectItem key={type.value}>{type.label}</SelectItem>
            ))}
          </Select>
        )}
      </form.Field>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <form.Field name="hitTraxAssessment.avgExitVelo">
          {(field: any) => (
            <DecimalNumberInput
              label="Avg Exit Velo"
              step="0.01"
              value={
                typeof field.state.value === "number"
                  ? field.state.value
                  : undefined
              }
              onChangeNumber={(n) => field.handleChange(n)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>
        <form.Field name="hitTraxAssessment.avgHardHit">
          {(field: any) => (
            <DecimalNumberInput
              label="Hard Hit %"
              step="0.01"
              value={
                typeof field.state.value === "number"
                  ? field.state.value
                  : undefined
              }
              onChangeNumber={(n) => field.handleChange(n)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>
        <form.Field name="hitTraxAssessment.maxVelo">
          {(field: any) => (
            <DecimalNumberInput
              label="Max Velo"
              step="0.01"
              value={
                typeof field.state.value === "number"
                  ? field.state.value
                  : undefined
              }
              onChangeNumber={(n) => field.handleChange(n)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>
        <form.Field name="hitTraxAssessment.maxDist">
          {(field: any) => (
            <DecimalNumberInput
              label="Max Dist"
              step="0.01"
              value={
                typeof field.state.value === "number"
                  ? field.state.value
                  : undefined
              }
              onChangeNumber={(n) => field.handleChange(n)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>
        <form.Field name="hitTraxAssessment.fbAndGbPct">
          {(field: any) => (
            <DecimalNumberInput
              label="FB and GB Pct"
              step="0.01"
              value={
                typeof field.state.value === "number"
                  ? field.state.value
                  : undefined
              }
              onChangeNumber={(n) => field.handleChange(n)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>
        <form.Field name="hitTraxAssessment.lineDrivePct">
          {(field: any) => (
            <DecimalNumberInput
              label="Line Drive Pct"
              step="0.01"
              value={
                typeof field.state.value === "number"
                  ? field.state.value
                  : undefined
              }
              onChangeNumber={(n) => field.handleChange(n)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>
      </div>
    </CardBody>
  </Card>
);

export default HitTraxAssessmentForm;

"use client";

import React from "react";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import DecimalNumberInput from "@/components/ui/DecimalNumberInput";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { form: any };

export const ArmCareAssessmentForm: React.FC<Props> = ({ form }) => (
  <Card className="mb-1 rounded-lg border border-blue-200 bg-default p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
        ArmCare Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {/* Shoulder ER*/}
        <form.Field name="armCare.shoulder_er_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder ER (L)"
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

        <form.Field name="armCare.shoulder_er_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder ER (R)"
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
        {/* Shoulder IR*/}
        <form.Field name="armCare.shoulder_ir_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder IR (L)"
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

        <form.Field name="armCare.shoulder_ir_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder IR (R)"
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
        {/* Shoulder Flexion*/}
        <form.Field name="armCare.shoulder_flexion_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder Flexion (L)"
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

        <form.Field name="armCare.shoulder_flexion_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder Flexion (R)"
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

        {/* Supine Hip ER*/}
        <form.Field name="armCare.supine_hip_er_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Supine Hip ER (L)"
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

        <form.Field name="armCare.supine_hip_er_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Supine Hip ER (R)"
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

        {/* Supine Hip IR*/}
        <form.Field name="armCare.supine_hip_ir_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Supine Hip IR (L)"
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

        <form.Field name="armCare.supine_hip_ir_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Supine Hip IR (R)"
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

        {/* Straight Leg*/}
        <form.Field name="armCare.straight_leg_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Straight Leg (L)"
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

        <form.Field name="armCare.straight_leg_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Straight Leg (R)"
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

      <div className="mt-4">
        {/* Notes */}
        <form.Field name="armCare.notes">
          {(field: any) => (
            <Textarea
              label="Notes"
              placeholder="Add any notes about this assessment..."
              description="Optional field for additional assessment details"
              value={
                typeof field.state.value === "string" ? field.state.value : ""
              }
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              minRows={4}
            />
          )}
        </form.Field>
      </div>
    </CardBody>
  </Card>
);

export default ArmCareAssessmentForm;

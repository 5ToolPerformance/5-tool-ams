"use client";

import React from "react";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import DecimalNumberInput from "@/components/ui/DecimalNumberInput";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { form: any };

const TrueStrengthAssessmentForm: React.FC<Props> = ({ form }) => (
  <Card className="mb-1 rounded-lg border border-blue-200 bg-default p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
        True Strength Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {/* Seated Shoulder ER*/}
        <form.Field name="trueStrength.seated_shoulder_er_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Seated Shoulder ER (L)"
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

        <form.Field name="trueStrength.seated_shoulder_er_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Seated Shoulder ER (R)"
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

        {/* Seated Shoulder IR*/}
        <form.Field name="trueStrength.seated_shoulder_ir_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Seated Shoulder IR (L)"
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

        <form.Field name="trueStrength.seated_shoulder_ir_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Seated Shoulder IR (R)"
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

        {/* Shoulder Rotation */}
        <form.Field name="trueStrength.shoulder_rotation_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder Rotation (L)"
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

        <form.Field name="trueStrength.shoulder_rotation_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder Rotation (R)"
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

        {/* Shoulder Rotation RFD */}
        <form.Field name="trueStrength.shoulder_rotation_rfd_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder Rotation RFD (L)"
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

        <form.Field name="trueStrength.shoulder_rotation_rfd_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Shoulder Rotation RFD (R)"
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

        {/* Hip Rotation */}
        <form.Field name="trueStrength.hip_rotation_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Hip Rotation (L)"
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

        <form.Field name="trueStrength.hip_rotation_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Hip Rotation (R)"
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

        {/* Hip Rotation RFD */}
        <form.Field name="trueStrength.hip_rotation_rfd_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Hip Rotation RFD (L)"
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

        <form.Field name="trueStrength.hip_rotation_rfd_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Hip Rotation RFD (R)"
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
        <form.Field name="trueStrength.notes">
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

export default TrueStrengthAssessmentForm;

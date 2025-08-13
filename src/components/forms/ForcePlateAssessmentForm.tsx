"use client";

import React from "react";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import DecimalNumberInput from "@/components/ui/DecimalNumberInput";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = { form: any };

const ForcePlateAssessmentForm: React.FC<Props> = ({ form }) => (
  <Card className="mb-1 rounded-lg border border-blue-200 bg-default p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
        Force Plate Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {/* CMJ */}
        <form.Field name="forcePlate.cmj">
          {(field: any) => (
            <DecimalNumberInput
              label="CMJ"
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

        {/* Drop Jump */}
        <form.Field name="forcePlate.drop_jump">
          {(field: any) => (
            <DecimalNumberInput
              label="Drop Jump"
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

        {/* Pogo */}
        <form.Field name="forcePlate.pogo">
          {(field: any) => (
            <DecimalNumberInput
              label="Pogo"
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

        {/* Mid Thigh Pull */}
        <form.Field name="forcePlate.mid_thigh_pull">
          {(field: any) => (
            <DecimalNumberInput
              label="Mid Thigh Pull"
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

        {/* MTP Time */}
        <form.Field name="forcePlate.mtp_time">
          {(field: any) => (
            <DecimalNumberInput
              label="MTP Time"
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

        {/* Cop ML */}
        <form.Field name="forcePlate.cop_ml_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Cop ML (L)"
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

        <form.Field name="forcePlate.cop_ml_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Cop ML (R)"
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

        {/* Cop AP */}
        <form.Field name="forcePlate.cop_ap_l">
          {(field: any) => (
            <DecimalNumberInput
              label="Cop AP (L)"
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

        <form.Field name="forcePlate.cop_ap_r">
          {(field: any) => (
            <DecimalNumberInput
              label="Cop AP (R)"
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
        <form.Field name="forcePlate.notes">
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

export default ForcePlateAssessmentForm;

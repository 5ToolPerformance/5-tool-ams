"use client";

import React from "react";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import DecimalNumberInput from "@/components/ui/DecimalNumberInput";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { form: any };

const HittingAssessmentForm: React.FC<Props> = ({ form }) => (
  <Card className="mb-1 rounded-lg border border-orange-200 bg-default p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-orange-900 dark:text-orange-100">
        Hitting Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <form.Field name="hittingAssessment.upper">
        {(field: any) => (
          <Textarea
            className="py-2"
            label="Upper"
            value={
              field.state.value !== undefined && field.state.value !== null
                ? String(field.state.value)
                : ""
            }
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors.join(", ")}
            isRequired
          />
        )}
      </form.Field>
      <form.Field name="hittingAssessment.lower">
        {(field: any) => (
          <Textarea
            label="Lower"
            className="py-2"
            value={
              field.state.value !== undefined && field.state.value !== null
                ? String(field.state.value)
                : ""
            }
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors.join(", ")}
            isRequired
          />
        )}
      </form.Field>
      <form.Field name="hittingAssessment.head">
        {(field: any) => (
          <Textarea
            label="Head"
            className="py-2"
            value={
              field.state.value !== undefined && field.state.value !== null
                ? String(field.state.value)
                : ""
            }
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors.join(", ")}
            isRequired
          />
        )}
      </form.Field>
      <form.Field name="hittingAssessment.load">
        {(field: any) => (
          <Textarea
            label="Load"
            className="py-2"
            value={
              field.state.value !== undefined && field.state.value !== null
                ? String(field.state.value)
                : ""
            }
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors.join(", ")}
            isRequired
          />
        )}
      </form.Field>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <form.Field name="hittingAssessment.max_ev">
          {(field: any) => (
            <DecimalNumberInput
              label="Max EV"
              className="py-2"
              placeholder="102.3"
              value={
                typeof field.state.value === "number"
                  ? field.state.value
                  : undefined
              }
              step="0.01"
              onChangeNumber={(n) => field.handleChange(n)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>
        <form.Field name="hittingAssessment.line_drive_pct">
          {(field: any) => (
            <DecimalNumberInput
              label="Line Drive Pct"
              placeholder="67.3"
              className="py-2"
              value={
                typeof field.state.value === "number"
                  ? field.state.value
                  : undefined
              }
              step="0.01"
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

export default HittingAssessmentForm;

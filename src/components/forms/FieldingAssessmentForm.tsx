"use client";

import React from "react";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import DecimalNumberInput from "@/components/ui/DecimalNumberInput";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { form: any };

const FieldingAssessmentForm: React.FC<Props> = ({ form }) => (
  <Card className="mb-1 rounded-lg border border-orange-200 bg-default p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-orange-900 dark:text-orange-100">
        Fielding Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <form.Field name="fieldingAssessment.glovework">
        {(field: any) => (
          <Textarea
            className="py-2"
            label="Glovework"
            value={
              field.state.value !== undefined && field.state.value !== null
                ? String(field.state.value)
                : ""
            }
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors.join(", ")}
          />
        )}
      </form.Field>
      <form.Field name="fieldingAssessment.footwork">
        {(field: any) => (
          <Textarea
            label="Footwork"
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
          />
        )}
      </form.Field>
      <form.Field name="fieldingAssessment.throwing">
        {(field: any) => (
          <Textarea
            label="Throwing"
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
          />
        )}
      </form.Field>
      <form.Field name="fieldingAssessment.throwdown_counter">
        {(field: any) => (
          <DecimalNumberInput
            label="Throwdown Counter"
            className="py-2"
            placeholder="102"
            value={
              typeof field.state.value === "number"
                ? field.state.value
                : undefined
            }
            step="1"
            onChangeNumber={(n) => field.handleChange(n)}
            onBlur={field.handleBlur}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors.join(", ")}
          />
        )}
      </form.Field>
      <form.Field name="fieldingAssessment.live">
        {(field: any) => (
          <Textarea
            label="Live"
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
          />
        )}
      </form.Field>
      <form.Field name="fieldingAssessment.consistency">
        {(field: any) => (
          <Textarea
            label="Consistency"
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
          />
        )}
      </form.Field>
      <form.Field name="fieldingAssessment.situational">
        {(field: any) => (
          <Textarea
            label="Situational"
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
          />
        )}
      </form.Field>
      <form.Field name="fieldingAssessment.mobility">
        {(field: any) => (
          <Textarea
            label="Mobility/S&C/Coordination"
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
          />
        )}
      </form.Field>
    </CardBody>
  </Card>
);

export default FieldingAssessmentForm;

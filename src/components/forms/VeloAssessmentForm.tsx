"use client";

import React from "react";

import { Card, CardBody, CardHeader } from "@heroui/react";

import DecimalNumberInput from "../ui/DecimalNumberInput";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { form: any };

const VeloAssessmentForm: React.FC<Props> = ({ form }) => (
  <Card className="mb-1 rounded-lg border border-orange-200 bg-default p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-orange-900 dark:text-orange-100">
        Velo Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <form.Field name="veloAssessment.intent">
        {(field: any) => (
          <DecimalNumberInput
            label="Intent (%)"
            step="1"
            value={
              typeof field.state.value === "number"
                ? field.state.value
                : undefined
            }
            onChangeNumber={(n) => field.handleChange(n)}
            onBlur={field.handleBlur}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors.join(", ")}
          />
        )}
      </form.Field>
      <form.Field name="veloAssessment.avgVelo">
        {(field: any) => (
          <DecimalNumberInput
            className="mt-4"
            label="Avg Velo (mph)"
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
          />
        )}
      </form.Field>
      <form.Field name="veloAssessment.topVelo">
        {(field: any) => (
          <DecimalNumberInput
            className="mt-4"
            label="Top Velo (mph)"
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
          />
        )}
      </form.Field>
      <form.Field name="veloAssessment.strikePct">
        {(field: any) => (
          <DecimalNumberInput
            className="mt-4"
            label="Strike %"
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
          />
        )}
      </form.Field>
    </CardBody>
  </Card>
);

export default VeloAssessmentForm;

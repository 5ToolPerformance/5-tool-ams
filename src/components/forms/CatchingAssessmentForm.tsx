"use client";

import React from "react";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import DecimalNumberInput from "../ui/DecimalNumberInput";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { form: any };

const CatchingAssessmentForm: React.FC<Props> = ({ form }) => (
  <Card className="mb-1 rounded-lg border border-orange-200 bg-default p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-orange-900 dark:text-orange-100">
        Catching Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <form.Field name="catchingAssessment.feel">
        {(field: any) => (
          <DecimalNumberInput
            label="Feel (1-10)"
            className="py-2"
            placeholder="1-10"
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
      <form.Field name="catchingAssessment.last4">
        {(field: any) => (
          <DecimalNumberInput
            label="Innings in Last 4 Days"
            className="py-2"
            placeholder="14"
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
      <form.Field name="catchingAssessment.readyBy">
        {(field: any) => (
          <DecimalNumberInput
            label="Ready By (in days)"
            className="py-2"
            placeholder="3"
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
      <form.Field name="catchingAssessment.catchThrow">
        {(field: any) => (
          <Textarea
            className="py-2"
            label="Catch Throw"
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
      <form.Field name="catchingAssessment.recieving">
        {(field: any) => (
          <Textarea
            label="Recieving"
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
      <form.Field name="catchingAssessment.blocking">
        {(field: any) => (
          <Textarea
            label="Blocking"
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
      <form.Field name="catchingAssessment.iq">
        {(field: any) => (
          <Textarea
            label="IQ"
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
      <form.Field name="catchingAssessment.mobility">
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
      <form.Field name="catchingAssessment.numThrows">
        {(field: any) => (
          <DecimalNumberInput
            label="Number of Throws"
            className="py-2"
            placeholder="10"
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
    </CardBody>
  </Card>
);

export default CatchingAssessmentForm;

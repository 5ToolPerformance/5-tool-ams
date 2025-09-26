"use client";

import React from "react";

import { Card, CardBody, CardHeader } from "@heroui/react";

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
      <form.Field name="veloAssessment.pitchType">
        {(field: any) => <div></div>}
      </form.Field>
      <form.Field name="hittingAssessment.lower">
        {(field: any) => <div></div>}
      </form.Field>
      <form.Field name="hittingAssessment.head">
        {(field: any) => <div></div>}
      </form.Field>
      <form.Field name="hittingAssessment.load">
        {(field: any) => <div></div>}
      </form.Field>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <form.Field name="hittingAssessment.max_ev">
          {(field: any) => <div></div>}
        </form.Field>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <form.Field name="hittingAssessment.max_ev">
          {(field: any) => <div></div>}
        </form.Field>
        <form.Field name="hittingAssessment.line_drive_pct">
          {(field: any) => <div></div>}
        </form.Field>
      </div>
    </CardBody>
  </Card>
);

export default VeloAssessmentForm;

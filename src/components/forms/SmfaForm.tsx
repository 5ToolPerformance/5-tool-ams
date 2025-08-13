"use client";

import React from "react";

import { Card, CardBody, CardHeader, Input, Textarea } from "@heroui/react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { form: any };

const SmfaForm: React.FC<Props> = ({ form }) => (
  <Card className="mb-1 rounded-lg border border-blue-200 bg-default p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
        SMFA Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {/* Pelvic Rotation */}
        <form.Field name="smfa.pelvic_rotation_l">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Pelvic Rotation (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="smfa.pelvic_rotation_r">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Pelvic Rotation (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* Seated Trunk Rotation */}
        <form.Field name="smfa.seated_trunk_rotation_l">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Seated Trunk Rotation (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="smfa.seated_trunk_rotation_r">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Seated Trunk Rotation (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* Ankle Test */}
        <form.Field name="smfa.ankle_test_l">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Ankle Test (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="smfa.ankle_test_r">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Ankle Test (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* Forearm Test */}
        <form.Field name="smfa.forearm_test_l">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Forearm Test (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="smfa.forearm_test_r">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Forearm Test (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* Cervical Rotation */}
        <form.Field name="smfa.cervical_rotation_l">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Cervical Rotation (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="smfa.cervical_rotation_r">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Cervical Rotation (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* MSF */}
        <form.Field name="smfa.msf_l">
          {(field: any) => (
            <Input
              type="checkbox"
              label="MSF (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="smfa.msf_r">
          {(field: any) => (
            <Input
              type="checkbox"
              label="MSF (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* MSE */}
        <form.Field name="smfa.mse_l">
          {(field: any) => (
            <Input
              type="checkbox"
              label="MSE (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="smfa.mse_r">
          {(field: any) => (
            <Input
              type="checkbox"
              label="MSE (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* MSR */}
        <form.Field name="smfa.msr_l">
          {(field: any) => (
            <Input
              type="checkbox"
              label="MSR (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="smfa.msr_r">
          {(field: any) => (
            <Input
              type="checkbox"
              label="MSR (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* Pelvic Tilt */}
        <form.Field name="smfa.pelvic_tilt">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Pelvic Tilt"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* Squat Test */}
        <form.Field name="smfa.squat_test">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Squat Test"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* Cervical Flexion */}
        <form.Field name="smfa.cervical_flexion">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Cervical Flexion"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>

        {/* Cervical Extension */}
        <form.Field name="smfa.cervical_extension">
          {(field: any) => (
            <Input
              type="checkbox"
              label="Cervical Extension"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Boolean(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>
      </div>

      <div className="mt-4">
        {/* Notes */}
        <form.Field name="smfa.notes">
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

export default SmfaForm;

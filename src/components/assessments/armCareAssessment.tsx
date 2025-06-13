import { Card, CardBody, CardHeader, Input, Textarea } from "@heroui/react";

import { BaseAssessmentProps } from "@/types/assessments";
import { LessonFieldApi } from "@/types/lessons";

export const ArmCareAssessment: React.FC<BaseAssessmentProps> = ({ form }) => (
  <Card className="rounded-lg border border-blue-200 bg-blue-50 p-6">
    <CardHeader>
      <h3 className="mb-4 text-lg font-semibold text-blue-900">
        ArmCare Assessment
      </h3>
    </CardHeader>
    <CardBody>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {/* Shoulder ER*/}
        <form.Field name="armCare.shoulder_er_l">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Shoulder ER (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>

        <form.Field name="armCare.shoulder_er_r">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Shoulder ER (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>
        {/* Shoulder IR*/}
        <form.Field name="armCare.shoulder_ir_l">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Shoulder IR (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>

        <form.Field name="armCare.shoulder_ir_r">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Shoulder IR (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>
        {/* Shoulder Flexion*/}
        <form.Field name="armCare.shoulder_flexion_l">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Shoulder Flexion (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>

        <form.Field name="armCare.shoulder_flexion_r">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Shoulder Flexion (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>

        {/* Supine Hip ER*/}
        <form.Field name="armCare.supine_hip_er_l">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Supine Hip ER (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>

        <form.Field name="armCare.supine_hip_er_r">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Supine Hip ER (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>

        {/* Supine Hip IR*/}
        <form.Field name="armCare.supine_hip_ir_l">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Supine Hip IR (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>

        <form.Field name="armCare.supine_hip_ir_r">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Supine Hip IR (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>

        {/* Straight Leg*/}
        <form.Field name="armCare.straight_leg_l">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Straight Leg (L)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
              isRequired
            />
          )}
        </form.Field>

        <form.Field name="armCare.straight_leg_r">
          {(field: LessonFieldApi<number>) => (
            <Input
              type="number"
              label="Straight Leg (R)"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
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
          {(field: LessonFieldApi<string>) => (
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

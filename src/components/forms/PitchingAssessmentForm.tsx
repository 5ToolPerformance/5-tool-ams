"use client";

import React from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";

import DecimalNumberInput from "@/components/ui/DecimalNumberInput";
import { DATE_RANGE_ENUM, DateRange } from "@/types/lessons";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { form: any };

const PitchingAssessmentForm: React.FC<Props> = ({ form }) => (
  <>
    <Card className="mb-1 rounded-lg border border-green-200 bg-default p-6">
      <CardHeader>
        <h3 className="mb-4 text-lg font-semibold text-green-900 dark:text-green-100">
          Pitching Assessment
        </h3>
      </CardHeader>
      <CardBody>
        <form.Field name="pitchingAssessment.upper">
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
        <form.Field name="pitchingAssessment.mid">
          {(field: any) => (
            <Textarea
              className="py-2"
              label="Mid"
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
        <form.Field name="pitchingAssessment.lower">
          {(field: any) => (
            <Textarea
              className="py-2"
              label="Lower"
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
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <form.Field name="pitchingAssessment.velo_mound_2oz">
            {(field: any) => (
              <DecimalNumberInput
                label="Mound Velo (2oz)"
                className="py-2"
                placeholder="85.3"
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
              />
            )}
          </form.Field>
          <form.Field name="pitchingAssessment.velo_mound_4oz">
            {(field: any) => (
              <DecimalNumberInput
                label="Mound Velo (4oz)"
                className="py-2"
                placeholder="85.3"
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
              />
            )}
          </form.Field>
          <form.Field name="pitchingAssessment.velo_mound_5oz">
            {(field: any) => (
              <DecimalNumberInput
                label="Mound Velo (5oz)"
                className="py-2"
                placeholder="85.3"
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
              />
            )}
          </form.Field>
          <form.Field name="pitchingAssessment.velo_mound_6oz">
            {(field: any) => (
              <DecimalNumberInput
                label="Mound Velo (6oz)"
                className="py-2"
                placeholder="85.3"
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
              />
            )}
          </form.Field>
          <form.Field name="pitchingAssessment.velo_pull_down_2oz">
            {(field: any) => (
              <DecimalNumberInput
                label="Pull Down Velo (2oz)"
                className="py-2"
                placeholder="85.3"
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
              />
            )}
          </form.Field>
          <form.Field name="pitchingAssessment.velo_pull_down_4oz">
            {(field: any) => (
              <DecimalNumberInput
                label="Pull Down Velo (4oz)"
                className="py-2"
                placeholder="85.3"
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
              />
            )}
          </form.Field>
          <form.Field name="pitchingAssessment.velo_pull_down_5oz">
            {(field: any) => (
              <DecimalNumberInput
                label="Pull Down Velo (5oz)"
                className="py-2"
                placeholder="85.3"
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
              />
            )}
          </form.Field>
          <form.Field name="pitchingAssessment.velo_pull_down_6oz">
            {(field: any) => (
              <DecimalNumberInput
                label="Pull Down Velo (6oz)"
                className="py-2"
                placeholder="85.3"
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
              />
            )}
          </form.Field>
        </div>
        <form.Field name="pitchingAssessment.strike_pct">
          {(field: any) => (
            <DecimalNumberInput
              label="Strike %"
              className="py-2"
              placeholder="73%"
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
            />
          )}
        </form.Field>
        <form.Field name="pitchingAssessment.notes">
          {(field: any) => (
            <Textarea
              label="Notes"
              className="py-2"
              placeholder="Enter notes"
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>
        <form.Field name="pitchingAssessment.goals">
          {(field: any) => (
            <Textarea
              label="Goals"
              className="py-2"
              placeholder="Enter goals"
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>
      </CardBody>
    </Card>
    <Card className="mb-1 rounded-lg border border-green-200 bg-default p-6">
      <CardHeader>
        <h3 className="mb-4 text-lg font-semibold text-green-900 dark:text-green-100">
          Check-in
        </h3>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <form.Field name="pitchingAssessment.last_time_pitched">
            {(field: any) => (
              <Select
                label="Last Time Pitched"
                placeholder="Select a date range"
                selectedKeys={field.state.value ? [field.state.value] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as DateRange;
                  field.handleChange(selectedKey);
                }}
              >
                {DATE_RANGE_ENUM.map((range) => (
                  <SelectItem key={range.value}>{range.label}</SelectItem>
                ))}
              </Select>
            )}
          </form.Field>
          <form.Field name="pitchingAssessment.next_time_pitched">
            {(field: any) => (
              <Select
                label="Next Time Pitched"
                placeholder="Select a date range"
                selectedKeys={field.state.value ? [field.state.value] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as DateRange;
                  field.handleChange(selectedKey);
                }}
              >
                {DATE_RANGE_ENUM.map((range) => (
                  <SelectItem key={range.value}>{range.label}</SelectItem>
                ))}
              </Select>
            )}
          </form.Field>
        </div>
        <form.Field name="pitchingAssessment.feel">
          {(field: any) => (
            <Input
              type="number"
              label="Feel"
              min={0}
              max={10}
              className="py-2"
              placeholder="1-10"
              value={
                field.state.value !== undefined && field.state.value !== null
                  ? String(field.state.value)
                  : ""
              }
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>
        <form.Field name="pitchingAssessment.concerns">
          {(field: any) => (
            <Textarea
              label="Concerns"
              className="py-2"
              placeholder="Enter concerns"
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>
      </CardBody>
    </Card>
  </>
);

export default PitchingAssessmentForm;

"use client";

import router from "next/router";
import React, { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";

import { LESSON_TYPES, LessonCreateData, LessonType } from "@/types/lessons";
import { User } from "@/types/users";

interface LessonsCreateProps {
  coachId: string | number | null | undefined;
}

const LessonCreationForm: React.FC<LessonsCreateProps> = ({ coachId }) => {
  const form = useForm<LessonCreateData>({
    defaultValues: {
      coachId: coachId,
      playerId: null,
      type: "strength",
      lessonDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      // Here you would call your API to create the lesson
      alert("Lesson created successfully! Check console for data.");
    },
  });

  // Initialize the selected lesson type from form state
  React.useEffect(() => {
    setSelectedLessonType("strength");
  }, []);

  const handleDateChange = (dateString: string) => {
    if (dateString) {
      form.setFieldValue("lessonDate", dateString);
    }
  };

  const [users, setUsers] = useState<User[]>([]);
  const [coaches, setCoaches] = useState<User[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersResponse, coachesResponse] = await Promise.all([
          fetch("/api/players"),
          fetch("/api/coaches"),
        ]);

        const playersData = await playersResponse.json();
        const coachesData = await coachesResponse.json();

        if (playersData.success && playersData.data) {
          setUsers(playersData.data);
        }

        if (coachesData.success && coachesData.data) {
          setCoaches(coachesData.data);
        }

        if (!playersData.success || !coachesData.success) {
          console.log("Players: ", playersData, "Coaches: ", coachesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [selectedLessonType, setSelectedLessonType] =
    React.useState<LessonType>("strength");

  // Assessment form configurations
  const assessmentConfigs = {
    strength: ["armCare", "smfa", "forcePlate", "trueStrength"],
    hitting: ["hittingAssessment"],
    pitching: ["pitchingAssessment"], // Assuming pitching uses hitting assessments
    catching: ["catchingAssessment"],
  };

  const ArmCareAssessmentForm = () => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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

  const ForcePlateAssessmentForm = () => (
    <div className="rounded-lg border border-green-200 bg-green-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-green-900">
        Force Plate Assessment
      </h3>
    </div>
  );

  const HittingAssessmentForm = () => (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-orange-900">
        Hitting Assessment
      </h3>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Create New Lesson
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill out the lesson details and complete relevant assessments based on
          the lesson type.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        {/* Basic Lesson Information */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Lesson Information
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Player Selection */}
            <form.Field
              name="playerId"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Please select a player" : undefined,
              }}
            >
              {(field) => (
                <Select
                  label="Player"
                  placeholder="Select a player"
                  selectedKeys={field.state.value ? [field.state.value] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    field.handleChange(selectedKey);
                  }}
                  isInvalid={!!field.state.meta.errors.length}
                  errorMessage={field.state.meta.errors.join(", ")}
                  isRequired
                >
                  {users.map((user) => (
                    <SelectItem key={user.id}>
                      {user.name || user.email || `User ${user.id.slice(0, 8)}`}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </form.Field>

            {/* Coach Selection */}
            <form.Field
              name="coachId"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Please select a coach" : undefined,
              }}
            >
              {(field) => (
                <Select
                  label="Coach"
                  placeholder="Select a coach"
                  selectedKeys={field.state.value ? [field.state.value] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    field.handleChange(selectedKey);
                  }}
                  isInvalid={!!field.state.meta.errors.length}
                  errorMessage={field.state.meta.errors.join(", ")}
                  isRequired
                >
                  {coaches.map((coach) => (
                    <SelectItem key={coach.id}>
                      {coach.name ||
                        coach.email ||
                        `Coach ${coach.id.slice(0, 8)}`}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </form.Field>

            {/* Lesson Type Selection */}
            <form.Field
              name="type"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Please select a lesson type" : undefined,
              }}
            >
              {(field) => (
                <Select
                  label="Lesson Type"
                  placeholder="Select lesson type"
                  selectedKeys={[field.state.value]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as LessonType;
                    field.handleChange(selectedKey);
                    setSelectedLessonType(selectedKey);
                  }}
                  isInvalid={!!field.state.meta.errors.length}
                  errorMessage={field.state.meta.errors.join(", ")}
                  isRequired
                >
                  {LESSON_TYPES.map((type) => (
                    <SelectItem key={type.value}>{type.label}</SelectItem>
                  ))}
                </Select>
              )}
            </form.Field>

            {/* Lesson Date - Using HTML date input */}
            <form.Field
              name="lessonDate"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Please select a lesson date" : undefined,
              }}
            >
              {(field) => (
                <Input
                  type="date"
                  label="Lesson Date"
                  value={field.state.value}
                  onChange={(e) => handleDateChange(e.target.value)}
                  onBlur={field.handleBlur}
                  isInvalid={!!field.state.meta.errors.length}
                  errorMessage={field.state.meta.errors.join(", ")}
                  isRequired
                />
              )}
            </form.Field>
          </div>

          <div className="mt-6">
            {/* Notes */}
            <form.Field name="notes">
              {(field) => (
                <Textarea
                  label="Notes"
                  placeholder="Add any notes about this lesson..."
                  description="Optional field for additional lesson details"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  minRows={4}
                />
              )}
            </form.Field>
          </div>
        </div>

        {/* Dynamic Assessment Forms */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Assessments</h2>

          {assessmentConfigs[selectedLessonType]?.includes("armCare") && (
            <ArmCareAssessmentForm />
          )}

          {assessmentConfigs[selectedLessonType]?.includes(
            "forcePlateAssessment"
          ) && <ForcePlateAssessmentForm />}

          {assessmentConfigs[selectedLessonType]?.includes(
            "hittingAssessment"
          ) && <HittingAssessmentForm />}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="light"
            onPress={() => router.back()}
            isDisabled={form.state.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            size="lg"
            isLoading={form.state.isSubmitting}
            isDisabled={form.state.isSubmitting || !form.state.canSubmit}
          >
            {form.state.isSubmitting ? "Creating Lesson..." : "Create Lesson"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LessonCreationForm;

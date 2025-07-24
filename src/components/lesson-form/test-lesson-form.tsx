"use client";

import { useRouter } from "next/navigation";
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

import { ApiResponse } from "@/types/api";
import { PlayerSelect } from "@/types/database";
import {
  DATE_RANGE_ENUM,
  DateRange,
  LESSON_TYPES,
  LessonCreateData,
  LessonType,
} from "@/types/lessons";
import { User } from "@/types/users";

interface LessonsCreateProps {
  coachId: string | number | null | undefined;
}

const LessonCreationForm: React.FC<LessonsCreateProps> = ({ coachId }) => {
  const router = useRouter();

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
      try {
        const response = await fetch("/api/lessons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        const result: ApiResponse<LessonCreateData> = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create lesson");
        }

        // Success! Navigate to lessons list or created lesson
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push("/" as any);
      } catch (error) {
        console.error("Error creating lesson:", error);
      }
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

  const [players, setPlayers] = useState<PlayerSelect[]>([]);
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
          setPlayers(playersData.data);
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
    fielding: ["fieldingAssessment"],
  };

  const ArmCareAssessmentForm = () => (
    <Card className="mb-1 rounded-lg border border-blue-200 bg-default p-6">
      <CardHeader>
        <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
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

  const SmfaForm = () => (
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
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          <form.Field name="smfa.pelvic_rotation_r">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* Seated Trunk Rotation */}
          <form.Field name="smfa.seated_trunk_rotation_l">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          <form.Field name="smfa.seated_trunk_rotation_r">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* Ankle Test */}
          <form.Field name="smfa.ankle_test_l">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          <form.Field name="smfa.ankle_test_r">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* Forearm Test */}
          <form.Field name="smfa.forearm_test_l">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          <form.Field name="smfa.forearm_test_r">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* Cervical Rotation */}
          <form.Field name="smfa.cervical_rotation_l">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          <form.Field name="smfa.cervical_rotation_r">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* MSF */}
          <form.Field name="smfa.msf_l">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          <form.Field name="smfa.msf_r">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* MSE */}
          <form.Field name="smfa.mse_l">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          <form.Field name="smfa.mse_r">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* MSR */}
          <form.Field name="smfa.msr_l">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          <form.Field name="smfa.msr_r">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* Pelvic Tilt */}
          <form.Field name="smfa.pelvic_tilt">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* Squat Test */}
          <form.Field name="smfa.squat_test">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* Cervical Flexion */}
          <form.Field name="smfa.cervical_flexion">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>

          {/* Cervical Extension */}
          <form.Field name="smfa.cervical_extension">
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>
        </div>

        <div className="mt-4">
          {/* Notes */}
          <form.Field name="smfa.notes">
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
            {(field) => (
              <Input
                type="number"
                label="CMJ"
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

          {/* Drop Jump */}
          <form.Field name="forcePlate.drop_jump">
            {(field) => (
              <Input
                type="number"
                label="Drop Jump"
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

          {/* Pogo */}
          <form.Field name="forcePlate.pogo">
            {(field) => (
              <Input
                type="number"
                label="Pogo"
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

          {/* Mid Thigh Pull */}
          <form.Field name="forcePlate.mid_thigh_pull">
            {(field) => (
              <Input
                type="number"
                label="Mid Thigh Pull"
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

          {/* MTP Time */}
          <form.Field name="forcePlate.mtp_time">
            {(field) => (
              <Input
                type="number"
                label="MTP Time"
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

          {/* Cop ML */}
          <form.Field name="forcePlate.cop_ml_l">
            {(field) => (
              <Input
                type="number"
                label="Cop ML (L)"
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

          <form.Field name="forcePlate.cop_ml_r">
            {(field) => (
              <Input
                type="number"
                label="Cop ML (R)"
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

          {/* Cop AP */}
          <form.Field name="forcePlate.cop_ap_l">
            {(field) => (
              <Input
                type="number"
                label="Cop AP (L)"
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

          <form.Field name="forcePlate.cop_ap_r">
            {(field) => (
              <Input
                type="number"
                label="Cop AP (R)"
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
          <form.Field name="forcePlate.notes">
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

  const TrueStrengthAssessmentForm = () => (
    <Card className="mb-1 rounded-lg border border-blue-200 bg-default p-6">
      <CardHeader>
        <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
          True Strength Assessment
        </h3>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {/* Seated Shoulder ER*/}
          <form.Field name="trueStrength.seated_shoulder_er_l">
            {(field) => (
              <Input
                type="number"
                label="Seated Shoulder ER (L)"
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

          <form.Field name="trueStrength.seated_shoulder_er_r">
            {(field) => (
              <Input
                type="number"
                label="Seated Shoulder ER (R)"
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

          {/* Seated Shoulder IR*/}
          <form.Field name="trueStrength.seated_shoulder_ir_l">
            {(field) => (
              <Input
                type="number"
                label="Seated Shoulder IR (L)"
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

          <form.Field name="trueStrength.seated_shoulder_ir_r">
            {(field) => (
              <Input
                type="number"
                label="Seated Shoulder IR (R)"
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

          {/* Shoulder Rotation */}
          <form.Field name="trueStrength.shoulder_rotation_l">
            {(field) => (
              <Input
                type="number"
                label="Shoulder Rotation (L)"
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

          <form.Field name="trueStrength.shoulder_rotation_r">
            {(field) => (
              <Input
                type="number"
                label="Shoulder Rotation (R)"
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

          {/* Shoulder Rotation RFD */}
          <form.Field name="trueStrength.shoulder_rotation_rfd_l">
            {(field) => (
              <Input
                type="number"
                label="Shoulder Rotation RFD (L)"
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

          <form.Field name="trueStrength.shoulder_rotation_rfd_r">
            {(field) => (
              <Input
                type="number"
                label="Shoulder Rotation RFD (R)"
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

          {/* Hip Rotation */}
          <form.Field name="trueStrength.hip_rotation_l">
            {(field) => (
              <Input
                type="number"
                label="Hip Rotation (L)"
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

          <form.Field name="trueStrength.hip_rotation_r">
            {(field) => (
              <Input
                type="number"
                label="Hip Rotation (R)"
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

          {/* Hip Rotation RFD */}
          <form.Field name="trueStrength.hip_rotation_rfd_l">
            {(field) => (
              <Input
                type="number"
                label="Hip Rotation RFD (L)"
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

          <form.Field name="trueStrength.hip_rotation_rfd_r">
            {(field) => (
              <Input
                type="number"
                label="Hip Rotation RFD (R)"
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
          <form.Field name="trueStrength.notes">
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

  const HittingAssessmentForm = () => (
    <Card className="mb-1 rounded-lg border border-orange-200 bg-default p-6">
      <CardHeader>
        <h3 className="mb-4 text-lg font-semibold text-orange-900 dark:text-orange-100">
          Hitting Assessment
        </h3>
      </CardHeader>
      <CardBody>
        <form.Field name="hittingAssessment.upper">
          {(field) => (
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
          {(field) => (
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
          {(field) => (
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
          {(field) => (
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
            {(field) => (
              <Input
                type="number"
                label="Max EV"
                className="py-2"
                placeholder="102.3"
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
          <form.Field name="hittingAssessment.line_drive_pct">
            {(field) => (
              <Input
                type="number"
                label="Line Drive Pct"
                placeholder="67.3"
                className="py-2"
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
      </CardBody>
    </Card>
  );

  const PitchingAssessmentForm = () => (
    <>
      <Card className="mb-1 rounded-lg border border-green-200 bg-default p-6">
        <CardHeader>
          <h3 className="mb-4 text-lg font-semibold text-green-900 dark:text-green-100">
            Pitching Assessment
          </h3>
        </CardHeader>
        <CardBody>
          <form.Field name="pitchingAssessment.upper">
            {(field) => (
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
            {(field) => (
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
            {(field) => (
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
              {(field) => (
                <Input
                  type="number"
                  label="Mound Velo (2oz)"
                  className="py-2"
                  placeholder="85.3"
                  value={
                    field.state.value !== undefined &&
                    field.state.value !== null
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
            <form.Field name="pitchingAssessment.velo_mound_4oz">
              {(field) => (
                <Input
                  type="number"
                  label="Mound Velo (4oz)"
                  className="py-2"
                  placeholder="85.3"
                  value={
                    field.state.value !== undefined &&
                    field.state.value !== null
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
            <form.Field name="pitchingAssessment.velo_mound_5oz">
              {(field) => (
                <Input
                  type="number"
                  label="Mound Velo (5oz)"
                  className="py-2"
                  placeholder="85.3"
                  value={
                    field.state.value !== undefined &&
                    field.state.value !== null
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
            <form.Field name="pitchingAssessment.velo_mound_6oz">
              {(field) => (
                <Input
                  type="number"
                  label="Mound Velo (6oz)"
                  className="py-2"
                  placeholder="85.3"
                  value={
                    field.state.value !== undefined &&
                    field.state.value !== null
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
            <form.Field name="pitchingAssessment.velo_pull_down_2oz">
              {(field) => (
                <Input
                  type="number"
                  label="Pull Down Velo (2oz)"
                  className="py-2"
                  placeholder="85.3"
                  value={
                    field.state.value !== undefined &&
                    field.state.value !== null
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
            <form.Field name="pitchingAssessment.velo_pull_down_4oz">
              {(field) => (
                <Input
                  type="number"
                  label="Pull Down Velo (4oz)"
                  className="py-2"
                  placeholder="85.3"
                  value={
                    field.state.value !== undefined &&
                    field.state.value !== null
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
            <form.Field name="pitchingAssessment.velo_pull_down_5oz">
              {(field) => (
                <Input
                  type="number"
                  label="Pull Down Velo (5oz)"
                  className="py-2"
                  placeholder="85.3"
                  value={
                    field.state.value !== undefined &&
                    field.state.value !== null
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
            <form.Field name="pitchingAssessment.velo_pull_down_6oz">
              {(field) => (
                <Input
                  type="number"
                  label="Pull Down Velo (6oz)"
                  className="py-2"
                  placeholder="85.3"
                  value={
                    field.state.value !== undefined &&
                    field.state.value !== null
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
          <form.Field name="pitchingAssessment.goals">
            {(field) => (
              <Textarea
                label="Goals"
                className="py-2"
                placeholder="Enter goals"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                isInvalid={!!field.state.meta.errors.length}
                errorMessage={field.state.meta.errors.join(", ")}
                isRequired
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
              {(field) => (
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
              {(field) => (
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
            {(field) => (
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
                isRequired
              />
            )}
          </form.Field>
          <form.Field name="pitchingAssessment.concerns">
            {(field) => (
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

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Create New Lesson
        </h1>
        <p className="mt-2 text-sm">
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
        <div className="rounded-lg bg-default p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-50">
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
                  {players.map((player) => (
                    <SelectItem key={player.id}>
                      {player.firstName + " " + player.lastName ||
                        `Player ${player.id.slice(0, 8)}`}
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
          <h2 className="text-xl font-semibold">Assessments</h2>

          {assessmentConfigs[selectedLessonType]?.includes("armCare") && (
            <div>
              <ArmCareAssessmentForm />
              <SmfaForm />
              <ForcePlateAssessmentForm />
              <TrueStrengthAssessmentForm />
            </div>
          )}

          {assessmentConfigs[selectedLessonType]?.includes(
            "forcePlateAssessment"
          ) && <ForcePlateAssessmentForm />}

          {assessmentConfigs[selectedLessonType]?.includes(
            "hittingAssessment"
          ) && <HittingAssessmentForm />}

          {assessmentConfigs[selectedLessonType]?.includes(
            "pitchingAssessment"
          ) && <PitchingAssessmentForm />}
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

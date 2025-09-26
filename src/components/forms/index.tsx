"use client";

import { useRouter } from "next/navigation";
import React from "react";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { useForm } from "@tanstack/react-form";

import { getCompleteLessonDefaults } from "@/lib/form-defaults";
import { ApiResponse } from "@/types/api";
import { PlayerSelect } from "@/types/database";
import { LESSON_TYPES, LessonCreateData, LessonType } from "@/types/lessons";
import { User } from "@/types/users";

// Extracted assessment subforms
import ArmCareAssessmentForm from "./ArmCareAssessmentForm";
import ForcePlateAssessmentForm from "./ForcePlateAssessmentForm";
import HitTraxAssessmentForm from "./HitTraxAssessmentForm";
import HittingAssessmentForm from "./HittingAssessmentForm";
import PitchingAssessmentForm from "./PitchingAssessmentForm";
import SmfaForm from "./SmfaForm";
import TrueStrengthAssessmentForm from "./TrueStrengthAssessmentForm";
import VeloAssessmentForm from "./VeloAssessmentForm";

interface ModularLessonFormProps {
  coachId: string | number | null | undefined;
}

type AssessmentKey =
  | "armCare"
  | "smfa"
  | "forcePlate"
  | "trueStrength"
  | "hittingAssessment"
  | "pitchingAssessment"
  | "hitTraxAssessment"
  | "veloAssessment";

const ALL_ASSESSMENTS: { key: AssessmentKey; label: string }[] = [
  { key: "armCare", label: "ArmCare" },
  { key: "smfa", label: "SMFA" },
  { key: "forcePlate", label: "Force Plate" },
  { key: "trueStrength", label: "True Strength" },
  { key: "hittingAssessment", label: "Hitting" },
  { key: "pitchingAssessment", label: "Pitching" },
  { key: "hitTraxAssessment", label: "HitTrax" },
  { key: "veloAssessment", label: "Velo" },
];

const ModularLessonForm: React.FC<ModularLessonFormProps> = ({ coachId }) => {
  const router = useRouter();

  const form = useForm({
    defaultValues: getCompleteLessonDefaults(coachId as string),
    onSubmit: async ({ value }) => {
      const completeData = value as LessonCreateData;

      const filteredData: LessonCreateData = {
        ...completeData,
        armCare: selectedAssessments.has("armCare")
          ? completeData.armCare
          : undefined,
        smfa: selectedAssessments.has("smfa") ? completeData.smfa : undefined,
        forcePlate: selectedAssessments.has("forcePlate")
          ? completeData.forcePlate
          : undefined,
        trueStrength: selectedAssessments.has("trueStrength")
          ? completeData.trueStrength
          : undefined,
        hittingAssessment: selectedAssessments.has("hittingAssessment")
          ? completeData.hittingAssessment
          : undefined,
        pitchingAssessment: selectedAssessments.has("pitchingAssessment")
          ? completeData.pitchingAssessment
          : undefined,
        hitTraxAssessment: selectedAssessments.has("hitTraxAssessment")
          ? completeData.hitTraxAssessment
          : undefined,
        veloAssessment: selectedAssessments.has("veloAssessment")
          ? completeData.veloAssessment
          : undefined,
        lessonId: completeData.lessonId,
      } as LessonCreateData;

      try {
        const response = await fetch("/api/lessons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredData),
        });

        const result: ApiResponse<LessonCreateData> = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create lesson");
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error creating lesson:", error);
      }
      alert("Lesson created successfully! Check console for data.");
    },
  });

  // Lesson type selection is stored directly in the form's "type" field

  // Assessment toggles
  const [selectedAssessments, setSelectedAssessments] = React.useState<
    Set<AssessmentKey>
  >(new Set());

  const toggleAssessment = (key: AssessmentKey) => {
    setSelectedAssessments((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Data sources
  const [players, setPlayers] = React.useState<PlayerSelect[]>([]);
  const [coaches, setCoaches] = React.useState<User[]>([]);

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

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Create New Lesson
        </h1>
        <p className="mt-2 text-sm">
          Select lesson details and add any assessments you want to include.
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
                <Autocomplete
                  label="Player"
                  placeholder="Select a player"
                  defaultItems={players}
                  selectedKey={field.state.value || undefined}
                  onSelectionChange={(key) => {
                    const selectedKey = key ? String(key) : "";
                    field.handleChange(selectedKey);
                  }}
                  isInvalid={!!field.state.meta.errors.length}
                  errorMessage={field.state.meta.errors.join(", ")}
                  isRequired
                >
                  {players.map((player) => {
                    const playerFullName = player.firstName.concat(
                      " ",
                      player.lastName
                    );
                    return (
                      <AutocompleteItem key={player.id}>
                        {playerFullName || `Player ${player.id.slice(0, 8)}`}
                      </AutocompleteItem>
                    );
                  })}
                </Autocomplete>
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
                <DatePicker
                  label="Lesson Date"
                  showMonthAndYearPickers
                  value={((): CalendarDate | undefined => {
                    const v = field.state.value as string | undefined;
                    if (!v) return undefined;
                    // Expecting YYYY-MM-DD
                    const match = /^\d{4}-\d{2}-\d{2}$/.test(v);
                    if (!match) return undefined;
                    const [y, m, d] = v.split("-").map(Number);
                    try {
                      return new CalendarDate(y, m, d);
                    } catch {
                      return undefined;
                    }
                  })()}
                  onChange={(value) => {
                    if (value) {
                      const yyyy = String(value.year).padStart(4, "0");
                      const mm = String(value.month).padStart(2, "0");
                      const dd = String(value.day).padStart(2, "0");
                      field.handleChange(`${yyyy}-${mm}-${dd}`);
                    } else {
                      field.handleChange("");
                    }
                  }}
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

        {/* Assessment Selection */}
        <div className="rounded-lg bg-default p-6">
          <h2 className="mb-4 text-xl font-semibold">Assessments</h2>
          <p className="mb-3 text-sm text-default-500">
            Use the buttons below to add or remove assessments for this lesson.
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_ASSESSMENTS.map(({ key, label }) => {
              const active = selectedAssessments.has(key);
              return (
                <Button
                  key={key}
                  size="sm"
                  color={active ? "primary" : "default"}
                  variant={active ? "solid" : "bordered"}
                  onPress={() => toggleAssessment(key)}
                >
                  {active ? `Remove ${label}` : `Add ${label}`}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Assessment Forms */}
        <div className="space-y-6">
          {selectedAssessments.has("armCare") && (
            <ArmCareAssessmentForm form={form} />
          )}

          {selectedAssessments.has("smfa") && <SmfaForm form={form} />}

          {selectedAssessments.has("forcePlate") && (
            <ForcePlateAssessmentForm form={form} />
          )}

          {selectedAssessments.has("trueStrength") && (
            <TrueStrengthAssessmentForm form={form} />
          )}

          {selectedAssessments.has("pitchingAssessment") && (
            <PitchingAssessmentForm form={form} />
          )}

          {selectedAssessments.has("hittingAssessment") && (
            <HittingAssessmentForm form={form} />
          )}

          {selectedAssessments.has("hitTraxAssessment") && (
            <HitTraxAssessmentForm form={form} />
          )}

          {selectedAssessments.has("veloAssessment") && (
            <VeloAssessmentForm form={form} />
          )}
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

export default ModularLessonForm;

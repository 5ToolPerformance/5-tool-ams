"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";

import {
  ApiResponse,
  LESSON_TYPES,
  Lesson,
  LessonFormData,
  LessonType,
  User,
} from "@/types/lessons";

export const LessonForm: React.FC = () => {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [coaches, setCoaches] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // TanStack Form setup
  const form = useForm({
    defaultValues: {
      userId: "",
      coachId: "",
      type: "strength" as LessonType,
      lessonDate: new Date(),
      notes: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      await handleSubmit(value);
    },
  });

  // Fetch users and coaches on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersResponse, coachesResponse] = await Promise.all([
          fetch("/api/players"),
          fetch("/api/coaches"),
        ]);

        const playersData: ApiResponse<User[]> = await playersResponse.json();
        const coachesData: ApiResponse<User[]> = await coachesResponse.json();

        if (playersData.success && playersData.data) {
          setUsers(playersData.data);
        }

        if (coachesData.success && coachesData.data) {
          setCoaches(coachesData.data);
        }

        if (!playersData.success || !coachesData.success) {
          console.log("Players: ", playersData, "Coaches: ", coachesData);
          setSubmitError("Failed to load users and coaches");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("Failed to load data. Please refresh the page.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData: LessonFormData) => {
    try {
      const requestData = {
        userId: formData.userId,
        coachId: formData.coachId,
        type: formData.type,
        lessonDate: formData.lessonDate.toISOString(),
        notes: formData.notes || undefined,
      };

      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result: ApiResponse<Lesson> = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create lesson");
      }

      // Success! Navigate to lessons list or created lesson
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push("/" as any);
    } catch (error) {
      console.error("Error creating lesson:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create lesson"
      );
    }
  };

  const handleDateChange = (dateString: string) => {
    if (dateString) {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      form.setFieldValue("lessonDate", date);
    }
  };

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (loadingData) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-600">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Lesson</h1>
        <Button variant="light" onPress={() => router.back()}>
          Cancel
        </Button>
      </div>

      {submitError && (
        <Card className="border-danger">
          <CardBody>
            <p className="text-sm text-danger">{submitError}</p>
          </CardBody>
        </Card>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Lesson Details</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Player Selection */}
            <form.Field
              name="userId"
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
                  value={formatDateForInput(field.state.value)}
                  onChange={(e) => handleDateChange(e.target.value)}
                  onBlur={field.handleBlur}
                  isInvalid={!!field.state.meta.errors.length}
                  errorMessage={field.state.meta.errors.join(", ")}
                  isRequired
                />
              )}
            </form.Field>

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
          </CardBody>
        </Card>

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

"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  CircularProgress,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";

import { useCoaches, usePlayers } from "@/hooks";
import { LESSON_TYPES, LessonType } from "@/types/lessons";

interface PlayerWriteupFormProps {
  coachId: string | number | null | undefined;
  playerId?: string | number | null | undefined;
}

interface Section {
  title: string;
  notes: string;
}

interface Goal {
  title: string;
  description: string;
}

export interface PlayerWriteupData {
  coach_id: string | number | null | undefined;
  player_id: string | number | null | undefined;
  type: LessonType;
  sections: Section[];
  goals: Goal[];
  notes: string;
}

const defaultSection: { section: Array<Section> } = {
  section: [],
};
const defaultGoal: { goal: Array<Goal> } = { goal: [] };

export default function PlayerWriteupForm({
  coachId,
  playerId,
}: PlayerWriteupFormProps) {
  const {
    players,
    isLoading: playersLoading,
    error: playersError,
  } = usePlayers();

  const {
    coaches,
    isLoading: coachesLoading,
    error: coachesError,
  } = useCoaches();

  const form = useForm({
    defaultValues: {
      coach_id: coachId,
      player_id: playerId || null,
      type: "hitting",
      sections: defaultSection,
      goals: defaultGoal,
      notes: "",
    },
    onSubmit: ({ value }) => {
      fetch("/api/writeups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  });

  if (playersLoading || coachesLoading) {
    return <CircularProgress />;
  }

  if (playersError || coachesError) {
    return <div>Error: {playersError || coachesError}</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mx-auto max-w-3xl space-y-6 p-4"
    >
      <form.Field
        name="player_id"
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
      <form.Field
        name="coach_id"
        validators={{
          onChange: ({ value }) =>
            !value ? "Please select a coach" : undefined,
        }}
      >
        {(field) => (
          <Autocomplete
            label="Coach"
            placeholder="Select a coach"
            defaultItems={coaches}
            selectedKey={field.state.value || undefined}
            onSelectionChange={(key) => {
              const selectedKey = key ? String(key) : "";
              field.handleChange(selectedKey);
            }}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors.join(", ")}
            isRequired
          >
            {coaches.map((coach) => {
              return (
                <AutocompleteItem key={coach.id}>
                  {coach.name || `Coach ${coach.id.slice(0, 8)}`}
                </AutocompleteItem>
              );
            })}
          </Autocomplete>
        )}
      </form.Field>
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
      <form.Field name="sections.section" mode="array">
        {(field) => (
          <div className="space-y-4">
            {field.state.value.map((_, i) => {
              return (
                <div
                  key={i}
                  className="rounded-medium border border-default-200 bg-content1 p-4"
                >
                  <form.Field name={`sections.section[${i}].title`}>
                    {(field) => (
                      <Input
                        label="Title"
                        value={field.state.value || ""}
                        onValueChange={field.handleChange}
                        isInvalid={!!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors.join(", ")}
                        isRequired
                        className="mb-3"
                      />
                    )}
                  </form.Field>
                  <form.Field name={`sections.section[${i}].notes`}>
                    {(field) => (
                      <Textarea
                        label="Notes"
                        value={field.state.value || ""}
                        onValueChange={field.handleChange}
                        minRows={3}
                        className="mb-1"
                      />
                    )}
                  </form.Field>
                  <Button
                    onPress={() => field.removeValue(i)}
                    type="button"
                    color="danger"
                    variant="flat"
                    size="sm"
                    className="mt-1"
                  >
                    Remove section
                  </Button>
                </div>
              );
            })}
            <Button
              onPress={() => field.pushValue({ title: "", notes: "" })}
              type="button"
              color="primary"
              variant="flat"
              size="sm"
              className="mt-1"
            >
              Add section
            </Button>
          </div>
        )}
      </form.Field>
      <form.Field name="goals.goal" mode="array">
        {(field) => (
          <div className="space-y-4">
            {field.state.value.map((_, i) => {
              return (
                <div
                  key={i}
                  className="rounded-medium border border-default-200 bg-content1 p-4"
                >
                  <form.Field name={`goals.goal[${i}].title`}>
                    {(field) => (
                      <Input
                        label="Title"
                        value={field.state.value || ""}
                        onValueChange={field.handleChange}
                        isInvalid={!!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors.join(", ")}
                        isRequired
                        className="mb-3"
                      />
                    )}
                  </form.Field>
                  <form.Field name={`goals.goal[${i}].description`}>
                    {(field) => (
                      <Textarea
                        label="Description"
                        value={field.state.value || ""}
                        onValueChange={field.handleChange}
                        minRows={3}
                        className="mb-1"
                      />
                    )}
                  </form.Field>
                  <Button
                    onPress={() => field.removeValue(i)}
                    type="button"
                    color="danger"
                    variant="flat"
                    size="sm"
                    className="mt-1"
                  >
                    Remove goal
                  </Button>
                </div>
              );
            })}
            <Button
              onPress={() => field.pushValue({ title: "", description: "" })}
              type="button"
              color="primary"
              variant="flat"
              size="sm"
              className="mt-1"
            >
              Add goal
            </Button>
          </div>
        )}
      </form.Field>
      <form.Field name="notes">
        {(field) => (
          <Textarea
            label="Notes"
            value={field.state.value || ""}
            onValueChange={field.handleChange}
            minRows={3}
          />
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex justify-end">
            <Button color="primary" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          </div>
        )}
      />
    </form>
  );
}

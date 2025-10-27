"use client";

import { Autocomplete, AutocompleteItem, Input, Textarea, Button } from "@heroui/react";
import { useForm } from "@tanstack/react-form";

import { useCoaches, usePlayers } from "@/hooks";

interface PlayerWriteupFormProps {
  coachId: string | number | null | undefined;
  playerId?: string | number | null | undefined;
}

interface SkillsetWriteup {
  title: string;
  notes: string;
}

interface GoalWriteup {
  title: string;
  description: string;
}

interface PlayerWriteupData {
  coach_id: string | number | null | undefined;
  player_id: string | number | null | undefined;
  skillset_writeups: SkillsetWriteup[];
  goal_writeups: GoalWriteup[];
  notes: string;
}

const defaultSkillsetWriteup: { skillset: Array<SkillsetWriteup> } = {
  skillset: [],
};
const defaultGoalWriteup: { goal: Array<GoalWriteup> } = { goal: [] };

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
      skillset_writeups: defaultSkillsetWriteup,
      goal_writeups: defaultGoalWriteup,
      notes: "",
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 max-w-3xl mx-auto p-4"
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
      <form.Field name="skillset_writeups.skillset" mode="array">
        {(field) => (
          <div className="space-y-4">
            {field.state.value.map((_, i) => {
              return (
                <div key={i} className="rounded-medium border border-default-200 p-4 bg-content1">
                  <form.Field name={`skillset_writeups.skillset[${i}].title`}>
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
                  <form.Field name={`skillset_writeups.skillset[${i}].notes`}>
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
              Add skillset
            </Button>
          </div>
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

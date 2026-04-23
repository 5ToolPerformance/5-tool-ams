"use client";

import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Slider,
  Switch,
  Textarea,
} from "@heroui/react";

import type {
  CreateHittingJournalEntryInput,
  CreateJournalEntryInput,
  CreateThrowingJournalEntryInput,
  HittingAtBatInput,
  JournalContextType,
  JournalEntryEditPayload,
  ThrowingArmCheckinInput,
  ThrowingWorkloadSegmentInput,
} from "@ams/domain/journal/types";

const CONTEXT_OPTIONS: Array<{ key: JournalContextType; label: string }> = [
  { key: "game", label: "Game" },
  { key: "practice", label: "Practice" },
  { key: "home", label: "Home" },
  { key: "gym", label: "Gym" },
  { key: "facility", label: "Facility" },
  { key: "lesson", label: "Lesson" },
  { key: "other", label: "Other" },
];

const THROW_TYPE_OPTIONS = [
  { key: "recovery_catch", label: "Recovery catch" },
  { key: "catch_play", label: "Catch play" },
  { key: "long_toss", label: "Long toss" },
  { key: "flat_ground", label: "Flat ground" },
  { key: "bullpen", label: "Bullpen" },
  { key: "game", label: "Game" },
  { key: "pulldown", label: "Pulldown" },
  { key: "other", label: "Other" },
] as const;

const THROW_INTENT_OPTIONS = [
  { key: "low", label: "Low" },
  { key: "moderate", label: "Moderate" },
  { key: "high", label: "High" },
  { key: "max", label: "Max" },
] as const;

const HITTING_OUTCOME_OPTIONS = [
  { key: "single", label: "Single" },
  { key: "double", label: "Double" },
  { key: "triple", label: "Triple" },
  { key: "home_run", label: "Home run" },
  { key: "walk", label: "Walk" },
  { key: "strikeout", label: "Strikeout" },
  { key: "hit_by_pitch", label: "HBP" },
  { key: "sac_fly", label: "Sac fly" },
  { key: "sac_bunt", label: "Sac bunt" },
  { key: "line_out", label: "Line out" },
  { key: "ground_out", label: "Ground out" },
  { key: "fly_out", label: "Fly out" },
  { key: "reach_on_error", label: "Reached on error" },
  { key: "fielder_choice", label: "Fielder's choice" },
  { key: "other", label: "Other" },
] as const;

export function createEmptyThrowingSegment(): ThrowingWorkloadSegmentInput {
  return {
    throwType: "catch_play",
    throwCount: 25,
    pitchCount: null,
    intentLevel: null,
    velocityAvg: null,
    velocityMax: null,
    pitchType: null,
    durationMinutes: null,
    notes: null,
    isEstimated: false,
  };
}

export function createEmptyArmCheckin(): ThrowingArmCheckinInput {
  return {
    armSoreness: null,
    bodyFatigue: null,
    armFatigue: null,
    recoveryScore: null,
    feelsOff: null,
    statusNote: null,
  };
}

function ReadinessSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-2 rounded-2xl border border-black/5 bg-default-50/70 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <span className="text-sm font-semibold text-default-500">{value ?? 0}</span>
      </div>
      <Slider
        aria-label={label}
        value={value ?? 0}
        onChange={(next) => onChange(Array.isArray(next) ? next[0] ?? 0 : next)}
        minValue={0}
        maxValue={5}
        step={1}
        showSteps
      />
    </div>
  );
}

function ScoreSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-2 rounded-2xl border border-black/5 bg-default-50/70 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <span className="text-sm font-semibold text-default-500">{value ?? 3}</span>
      </div>
      <Slider
        aria-label={label}
        value={value ?? 3}
        onChange={(next) => onChange(Array.isArray(next) ? next[0] ?? 3 : next)}
        minValue={1}
        maxValue={5}
        step={1}
        showSteps
      />
    </div>
  );
}

export function createEmptyAtBat(index = 1): HittingAtBatInput {
  return {
    atBatNumber: index,
    outcome: "single",
    resultCategory: null,
    pitchTypeSeen: null,
    pitchLocation: null,
    countAtResult: null,
    runnersInScoringPosition: null,
    rbi: null,
    notes: null,
  };
}

export function JournalSharedFields({
  value,
  onChange,
}: {
  value: CreateJournalEntryInput | JournalEntryEditPayload;
  onChange: (next: CreateJournalEntryInput | JournalEntryEditPayload) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Input
        type="date"
        label="Entry date"
        value={value.entryDate}
        onChange={(event) => onChange({ ...value, entryDate: event.target.value })}
      />
      <Select
        label="Context"
        selectedKeys={value.contextType ? [value.contextType] : []}
        onChange={(event) =>
          onChange({
            ...value,
            contextType: (event.target.value || null) as JournalContextType | null,
          })
        }
      >
        {CONTEXT_OPTIONS.map((option) => (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        ))}
      </Select>
      <Input
        label="Title"
        placeholder="Optional title"
        value={value.title ?? ""}
        onChange={(event) => onChange({ ...value, title: event.target.value || null })}
      />
      <Textarea
        label="Quick summary"
        minRows={2}
        placeholder="Optional shared note"
        value={value.summaryNote ?? ""}
        onChange={(event) => onChange({ ...value, summaryNote: event.target.value || null })}
      />
    </div>
  );
}

export function ThrowingJournalForm({
  value,
  onChange,
}: {
  value: CreateThrowingJournalEntryInput | (JournalEntryEditPayload & { entryType: "throwing" });
  onChange: (
    next: CreateThrowingJournalEntryInput | (JournalEntryEditPayload & { entryType: "throwing" })
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <JournalSharedFields value={value} onChange={(next) => onChange(next as typeof value)} />
      <div className="grid grid-cols-1 gap-3">
        <ScoreSlider
          label="Overall feel"
          value={value.overallFeel}
          onChange={(next) =>
            onChange({
              ...value,
              overallFeel: next,
            })
          }
        />
        <ScoreSlider
          label="Confidence"
          value={value.confidenceScore}
          onChange={(next) =>
            onChange({
              ...value,
              confidenceScore: next,
            })
          }
        />
      </div>
      <Textarea
        label="Session note"
        minRows={2}
        placeholder="How did it feel?"
        value={value.sessionNote ?? ""}
        onChange={(event) => onChange({ ...value, sessionNote: event.target.value || null })}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Workload segments</h3>
          <Button
            size="sm"
            variant="flat"
            onPress={() =>
              onChange({
                ...value,
                workloadSegments: [...value.workloadSegments, createEmptyThrowingSegment()],
              })
            }
          >
            Add segment
          </Button>
        </div>
        {value.workloadSegments.map((segment, index) => (
          <Card
            key={`segment-${index}`}
            className="border border-black/5 bg-white/70 dark:border-white/10 dark:bg-white/5"
          >
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Segment {index + 1}</p>
                {value.workloadSegments.length > 1 ? (
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() =>
                      onChange({
                        ...value,
                        workloadSegments: value.workloadSegments.filter((_, current) => current !== index),
                      })
                    }
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
              <Select
                label="Throw type"
                selectedKeys={[segment.throwType]}
                onChange={(event) => {
                  const workloadSegments = [...value.workloadSegments];
                  workloadSegments[index] = {
                    ...segment,
                    throwType: event.target.value as ThrowingWorkloadSegmentInput["throwType"],
                  };
                  onChange({ ...value, workloadSegments });
                }}
              >
                {THROW_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Throw count"
                  value={segment.throwCount.toString()}
                  onChange={(event) => {
                    const workloadSegments = [...value.workloadSegments];
                    workloadSegments[index] = {
                      ...segment,
                      throwCount: Number(event.target.value || 0),
                    };
                    onChange({ ...value, workloadSegments });
                  }}
                />
                <Select
                  label="Intent"
                  selectedKeys={segment.intentLevel ? [segment.intentLevel] : []}
                  onChange={(event) => {
                    const workloadSegments = [...value.workloadSegments];
                    workloadSegments[index] = {
                      ...segment,
                      intentLevel: (event.target.value || null) as ThrowingWorkloadSegmentInput["intentLevel"],
                    };
                    onChange({ ...value, workloadSegments });
                  }}
                >
                  {THROW_INTENT_OPTIONS.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>
              <Accordion variant="light">
                <AccordionItem
                  key={`segment-advanced-${index}`}
                  aria-label={`Advanced details for segment ${index + 1}`}
                  title="Advanced details"
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        label="Pitch count"
                        value={segment.pitchCount?.toString() ?? ""}
                        onChange={(event) => {
                          const workloadSegments = [...value.workloadSegments];
                          workloadSegments[index] = {
                            ...segment,
                            pitchCount: event.target.value ? Number(event.target.value) : null,
                          };
                          onChange({ ...value, workloadSegments });
                        }}
                      />
                      <Input
                        type="number"
                        label="Duration (min)"
                        value={segment.durationMinutes?.toString() ?? ""}
                        onChange={(event) => {
                          const workloadSegments = [...value.workloadSegments];
                          workloadSegments[index] = {
                            ...segment,
                            durationMinutes: event.target.value ? Number(event.target.value) : null,
                          };
                          onChange({ ...value, workloadSegments });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        label="Avg velo"
                        value={segment.velocityAvg?.toString() ?? ""}
                        onChange={(event) => {
                          const workloadSegments = [...value.workloadSegments];
                          workloadSegments[index] = {
                            ...segment,
                            velocityAvg: event.target.value ? Number(event.target.value) : null,
                          };
                          onChange({ ...value, workloadSegments });
                        }}
                      />
                      <Input
                        type="number"
                        label="Top velo"
                        value={segment.velocityMax?.toString() ?? ""}
                        onChange={(event) => {
                          const workloadSegments = [...value.workloadSegments];
                          workloadSegments[index] = {
                            ...segment,
                            velocityMax: event.target.value ? Number(event.target.value) : null,
                          };
                          onChange({ ...value, workloadSegments });
                        }}
                      />
                    </div>
                    <Input
                      label="Pitch type"
                      value={segment.pitchType ?? ""}
                      onChange={(event) => {
                        const workloadSegments = [...value.workloadSegments];
                        workloadSegments[index] = {
                          ...segment,
                          pitchType: event.target.value || null,
                        };
                        onChange({ ...value, workloadSegments });
                      }}
                    />
                    <Textarea
                      label="Notes"
                      minRows={2}
                      value={segment.notes ?? ""}
                      onChange={(event) => {
                        const workloadSegments = [...value.workloadSegments];
                        workloadSegments[index] = {
                          ...segment,
                          notes: event.target.value || null,
                        };
                        onChange({ ...value, workloadSegments });
                      }}
                    />
                    <Switch
                      isSelected={segment.isEstimated}
                      onValueChange={(selected) => {
                        const workloadSegments = [...value.workloadSegments];
                        workloadSegments[index] = {
                          ...segment,
                          isEstimated: selected,
                        };
                        onChange({ ...value, workloadSegments });
                      }}
                    >
                      Estimated count
                    </Switch>
                  </div>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Arm readiness</h3>
          <p className="text-xs text-default-500">Quick check-in from 0 to 5.</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <ReadinessSlider
            label="Arm soreness"
            value={value.armCheckin?.armSoreness ?? null}
            onChange={(next) =>
              onChange({
                ...value,
                armCheckin: {
                  ...(value.armCheckin ?? createEmptyArmCheckin()),
                  armSoreness: next,
                },
              })
            }
          />
          <ReadinessSlider
            label="Body fatigue"
            value={value.armCheckin?.bodyFatigue ?? null}
            onChange={(next) =>
              onChange({
                ...value,
                armCheckin: {
                  ...(value.armCheckin ?? createEmptyArmCheckin()),
                  bodyFatigue: next,
                },
              })
            }
          />
          <ReadinessSlider
            label="Arm fatigue"
            value={value.armCheckin?.armFatigue ?? null}
            onChange={(next) =>
              onChange({
                ...value,
                armCheckin: {
                  ...(value.armCheckin ?? createEmptyArmCheckin()),
                  armFatigue: next,
                },
              })
            }
          />
        </div>
      </div>

      <Accordion variant="splitted">
        <AccordionItem key="arm-checkin" aria-label="Arm check-in" title="Advanced arm details">
          <div className="space-y-3">
            <Input
              type="number"
              label="Recovery"
              min={0}
              max={5}
              value={value.armCheckin?.recoveryScore?.toString() ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  armCheckin: {
                    ...(value.armCheckin ?? createEmptyArmCheckin()),
                    recoveryScore: event.target.value ? Number(event.target.value) : null,
                  },
                })
              }
            />
            <Switch
              isSelected={Boolean(value.armCheckin?.feelsOff)}
              onValueChange={(selected) =>
                onChange({
                  ...value,
                  armCheckin: {
                    ...(value.armCheckin ?? createEmptyArmCheckin()),
                    feelsOff: selected,
                  },
                })
              }
            >
              Arm feels off today
            </Switch>
            <Textarea
              label="Status note"
              minRows={2}
              value={value.armCheckin?.statusNote ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  armCheckin: {
                    ...(value.armCheckin ?? createEmptyArmCheckin()),
                    statusNote: event.target.value || null,
                  },
                })
              }
            />
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function HittingJournalForm({
  value,
  onChange,
}: {
  value: CreateHittingJournalEntryInput | (JournalEntryEditPayload & { entryType: "hitting" });
  onChange: (
    next: CreateHittingJournalEntryInput | (JournalEntryEditPayload & { entryType: "hitting" })
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <JournalSharedFields value={value} onChange={(next) => onChange(next as typeof value)} />
      <div className="grid grid-cols-1 gap-3">
        <ScoreSlider
          label="Overall feel"
          value={value.overallFeel}
          onChange={(next) =>
            onChange({
              ...value,
              overallFeel: next,
            })
          }
        />
        <ScoreSlider
          label="Confidence"
          value={value.confidenceScore}
          onChange={(next) =>
            onChange({
              ...value,
              confidenceScore: next,
            })
          }
        />
      </div>
      <Textarea
        label="Game reflection"
        minRows={2}
        value={value.hittingSummaryNote ?? ""}
        onChange={(event) => onChange({ ...value, hittingSummaryNote: event.target.value || null })}
      />
      <Accordion variant="splitted">
        <AccordionItem key="hitting-details" aria-label="More details" title="More details">
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Opponent"
                value={value.opponent ?? ""}
                onChange={(event) => onChange({ ...value, opponent: event.target.value || null })}
              />
              <Input
                label="Team name"
                value={value.teamName ?? ""}
                onChange={(event) => onChange({ ...value, teamName: event.target.value || null })}
              />
            </div>
            <Input
              label="Location"
              value={value.location ?? ""}
              onChange={(event) => onChange({ ...value, location: event.target.value || null })}
            />
          </div>
        </AccordionItem>
      </Accordion>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">At-bats</h3>
          <Button
            size="sm"
            variant="flat"
            onPress={() =>
              onChange({
                ...value,
                atBats: [...value.atBats, createEmptyAtBat(value.atBats.length + 1)],
              })
            }
          >
            Add at-bat
          </Button>
        </div>
        {value.atBats.map((atBat, index) => (
          <Card
            key={`ab-${index}`}
            className="border border-black/5 bg-white/70 dark:border-white/10 dark:bg-white/5"
          >
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">At-bat {index + 1}</p>
                {value.atBats.length > 1 ? (
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() =>
                      onChange({
                        ...value,
                        atBats: value.atBats
                          .filter((_, current) => current !== index)
                          .map((item, current) => ({ ...item, atBatNumber: current + 1 })),
                      })
                    }
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
              <Select
                label="Outcome"
                selectedKeys={[atBat.outcome]}
                onChange={(event) => {
                  const atBats = [...value.atBats];
                  atBats[index] = {
                    ...atBat,
                    outcome: event.target.value as HittingAtBatInput["outcome"],
                  };
                  onChange({ ...value, atBats });
                }}
              >
                {HITTING_OUTCOME_OPTIONS.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
              <Textarea
                label="Notes"
                minRows={2}
                value={atBat.notes ?? ""}
                onChange={(event) => {
                  const atBats = [...value.atBats];
                  atBats[index] = { ...atBat, notes: event.target.value || null };
                  onChange({ ...value, atBats });
                }}
              />
              <Accordion variant="light">
                <AccordionItem key={`advanced-${index}`} aria-label="Advanced" title="Advanced details">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input
                        label="Pitch type seen"
                        value={atBat.pitchTypeSeen ?? ""}
                        onChange={(event) => {
                          const atBats = [...value.atBats];
                          atBats[index] = { ...atBat, pitchTypeSeen: event.target.value || null };
                          onChange({ ...value, atBats });
                        }}
                      />
                      <Input
                        label="Pitch location"
                        value={atBat.pitchLocation ?? ""}
                        onChange={(event) => {
                          const atBats = [...value.atBats];
                          atBats[index] = { ...atBat, pitchLocation: event.target.value || null };
                          onChange({ ...value, atBats });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input
                        label="Count at result"
                        value={atBat.countAtResult ?? ""}
                        onChange={(event) => {
                          const atBats = [...value.atBats];
                          atBats[index] = { ...atBat, countAtResult: event.target.value || null };
                          onChange({ ...value, atBats });
                        }}
                      />
                      <Input
                        type="number"
                        label="RBI"
                        value={atBat.rbi?.toString() ?? ""}
                        onChange={(event) => {
                          const atBats = [...value.atBats];
                          atBats[index] = { ...atBat, rbi: event.target.value ? Number(event.target.value) : null };
                          onChange({ ...value, atBats });
                        }}
                      />
                    </div>
                    <Switch
                      isSelected={Boolean(atBat.runnersInScoringPosition)}
                      onValueChange={(selected) => {
                        const atBats = [...value.atBats];
                        atBats[index] = { ...atBat, runnersInScoringPosition: selected };
                        onChange({ ...value, atBats });
                      }}
                    >
                      Runners in scoring position
                    </Switch>
                  </div>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

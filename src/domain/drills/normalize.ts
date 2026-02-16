import {
  DRILL_DISCIPLINES,
  DrillDiscipline,
  DrillWriteInput,
} from "@/domain/drills/types";

export function normalizeDrillWriteInput(input: DrillWriteInput): DrillWriteInput {
  const title = input.title?.trim();
  const description = input.description?.trim();
  const discipline = input.discipline;

  if (!title) {
    throw new Error("Drill title is required");
  }

  if (!description) {
    throw new Error("Drill description is required");
  }

  if (!discipline) {
    throw new Error("Drill discipline is required");
  }

  if (!DRILL_DISCIPLINES.includes(discipline as DrillDiscipline)) {
    throw new Error("Invalid drill discipline");
  }

  const tags = Array.from(
    new Set(
      (input.tags ?? [])
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    )
  );

  return {
    title,
    description,
    discipline,
    tags,
  };
}

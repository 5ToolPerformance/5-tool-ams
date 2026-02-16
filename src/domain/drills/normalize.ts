import { DrillWriteInput } from "@/domain/drills/types";

export function normalizeDrillWriteInput(input: DrillWriteInput): DrillWriteInput {
  const title = input.title?.trim();
  const description = input.description?.trim();

  if (!title) {
    throw new Error("Drill title is required");
  }

  if (!description) {
    throw new Error("Drill description is required");
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
    tags,
  };
}

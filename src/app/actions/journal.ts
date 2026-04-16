"use server";

import { revalidatePath } from "next/cache";

import {
  createJournalEntrySchema,
  updateJournalEntrySchema,
} from "@/domain/journal/schemas";
import type { CreateJournalEntryInput, UpdateJournalEntryInput } from "@/domain/journal/types";
import { requireClientPortalAccess } from "@/application/auth/client-auth";
import {
  assertCanAccessJournalEntry,
  assertCanLogPortalJournalForPlayer,
} from "@/application/journal/access";
import { createJournalEntry } from "@/application/journal/createJournalEntry";
import { deleteJournalEntry } from "@/application/journal/deleteJournalEntry";
import { getJournalEntryDetail } from "@/application/journal/getJournalEntryDetail";
import { updateJournalEntry } from "@/application/journal/updateJournalEntry";

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

function parseFieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[]> } }) {
  return error.flatten().fieldErrors;
}

export async function createJournalEntryAction(
  input: CreateJournalEntryInput
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireClientPortalAccess();
  const parsed = createJournalEntrySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields",
      fieldErrors: parseFieldErrors(parsed.error),
    };
  }

  try {
    await assertCanLogPortalJournalForPlayer({
      userId: auth.userId,
      facilityId: auth.facilityId,
      playerId: parsed.data.playerId,
    });

    const created = await createJournalEntry({
      input: parsed.data,
      facilityId: auth.facilityId,
      userId: auth.userId,
    });

    revalidatePath("/portal/journal");
    return { success: true, data: { id: created.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to create journal entry",
    };
  }
}

export async function updateJournalEntryAction(
  input: UpdateJournalEntryInput
): Promise<ActionResult> {
  const auth = await requireClientPortalAccess();
  const parsed = updateJournalEntrySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields",
      fieldErrors: parseFieldErrors(parsed.error),
    };
  }

  try {
    await assertCanAccessJournalEntry({
      userId: auth.userId,
      facilityId: auth.facilityId,
      journalEntryId: parsed.data.id,
      requireWrite: true,
    });

    await updateJournalEntry({
      input: parsed.data,
      facilityId: auth.facilityId,
    });

    revalidatePath("/portal/journal");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update journal entry",
    };
  }
}

export async function deleteJournalEntryAction(
  journalEntryId: string
): Promise<ActionResult> {
  const auth = await requireClientPortalAccess();

  try {
    await assertCanAccessJournalEntry({
      userId: auth.userId,
      facilityId: auth.facilityId,
      journalEntryId,
      requireWrite: true,
    });

    await deleteJournalEntry({
      journalEntryId,
      facilityId: auth.facilityId,
    });

    revalidatePath("/portal/journal");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to delete journal entry",
    };
  }
}

export async function getJournalEntryReadAction(
  journalEntryId: string
): Promise<ActionResult<Awaited<ReturnType<typeof getJournalEntryDetail>>>> {
  const auth = await requireClientPortalAccess();

  try {
    await assertCanAccessJournalEntry({
      userId: auth.userId,
      facilityId: auth.facilityId,
      journalEntryId,
      requireWrite: false,
    });

    const detail = await getJournalEntryDetail(journalEntryId);
    if (!detail) {
      return { success: false, error: "Journal entry not found" };
    }

    return { success: true, data: detail };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to load journal entry",
    };
  }
}

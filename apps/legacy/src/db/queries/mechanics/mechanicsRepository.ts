import { eq } from "drizzle-orm";

import db from "@/db";
import { mechanics } from "@/db/schema";

export type MechanicInsert = typeof mechanics.$inferInsert;
export type MechanicSelect = typeof mechanics.$inferSelect;

export async function listMechanics() {
    try {
      const res = await db
        .select()
        .from(mechanics)
        .orderBy(mechanics.type, mechanics.name);
      return res;
    } catch (error) {
      console.error(
        "[mechanicsRepository.findAll] Error finding all mechanics:",
        error
      );
      throw new Error("Failed to find all mechanics");
    }
}

export async function getMechanicById(id: string) {
    try {
      const res = await db.select().from(mechanics).where(eq(mechanics.id, id));
      return res[0] ?? null;
    } catch (error) {
      console.error(
        "[mechanicsRepository.findById] Error finding mechanic by ID:",
        error
      );
      throw new Error("Failed to find mechanic");
    }
}

export async function createMechanic(mechanic: MechanicInsert) {
    try {
      const [created] = await db.insert(mechanics).values(mechanic).returning();
      return created;
    } catch (error) {
      console.error(
        "[mechanicsRepository.create] Error creating mechanic:",
        error
      );
      throw new Error("Failed to create mechanic");
    }
}

export async function updateMechanic(id: string, mechanic: Partial<MechanicInsert>) {
    try {
      const [updated] = await db
        .update(mechanics)
        .set({
          ...mechanic,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(mechanics.id, id))
        .returning();

      return updated;
    } catch (error) {
      console.error(
        "[mechanicsRepository.update] Error updating mechanic:",
        error
      );
      throw new Error("Failed to update mechanic");
    }
}

export async function deleteMechanic(id: string) {
    try {
      await db.delete(mechanics).where(eq(mechanics.id, id));
    } catch (error) {
      console.error(
        "[mechanicsRepository.delete] Error deleting mechanic:",
        error
      );
      throw new Error("Failed to delete mechanic");
    }
}
export async function listMechanicsForLessonForm() {
    try {
      const res = await db
        .select({
          id: mechanics.id,
          name: mechanics.name,
          description: mechanics.description,
          type: mechanics.type,
          tags: mechanics.tags,
        })
        .from(mechanics);
      return res;
    } catch (error) {
      console.error(
        "[mechanicsRepository.findAllForLessonForm] Error finding all mechanics for lesson form:",
        error
      );
      throw new Error("Failed to find all mechanics for lesson form");
    }
}
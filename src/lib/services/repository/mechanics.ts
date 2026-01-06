import { eq } from "drizzle-orm";

import db from "@/db";
import { mechanics } from "@/db/schema";

export type MechanicInsert = typeof mechanics.$inferInsert;
export type MechanicSelect = typeof mechanics.$inferSelect;

export const mechanicsRepository = {
  findAll: async () => {
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
  },

  findById: async (id: string) => {
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
  },

  create: async (mechanic: MechanicInsert) => {
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
  },

  update: async (id: string, mechanic: Partial<MechanicInsert>) => {
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
  },

  delete: async (id: string) => {
    try {
      await db.delete(mechanics).where(eq(mechanics.id, id));
    } catch (error) {
      console.error(
        "[mechanicsRepository.delete] Error deleting mechanic:",
        error
      );
      throw new Error("Failed to delete mechanic");
    }
  },
};

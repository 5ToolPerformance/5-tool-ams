import { z } from "zod";

export const mechanicImportRowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["pitching", "hitting", "fielding", "catching", "strength"]),
  tags: z.string().optional(),
});

export type MechanicImportRow = z.infer<typeof mechanicImportRowSchema>;

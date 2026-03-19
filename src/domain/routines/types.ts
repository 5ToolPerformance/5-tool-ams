export type RoutineDocumentV1 = {
  version: 1;
  visibility: "player" | "universal";
  playerId?: string | null;
  disciplineId: string;

  overview: {
    summary?: string;
    usageNotes?: string;
  };

  mechanics: Array<{
    mechanicId: string;
    title?: string;
  }>;

  blocks: Array<{
    id: string;
    title: string;
    notes?: string;
    sortOrder: number;
    drills: Array<{
      drillId: string;
      title?: string;
      notes?: string;
      sortOrder: number;
    }>;
  }>;
};

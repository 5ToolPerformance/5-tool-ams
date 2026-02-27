/** Mechanic data associated with a lesson */
export interface LessonMechanicData {
  id: string;
  mechanicId: string;
  name: string;
  description: string | null;
  type: "pitching" | "hitting" | "fielding" | "catching" | "strength";
  tags: string[] | null;
  notes: string | null;
  /** Player this mechanic was logged for */
  playerId: string;
}

export interface LessonDrillData {
  id: string;
  drillId: string;
  title: string;
  description: string | null;
  discipline: string;
  notes: string | null;
  /** Player this drill was logged for */
  lessonPlayerId: string;
}

// TODO
export interface LessonAttachmentData {
  id: string;
}

// TODO
export interface LessonFatigueData {
  id: string;
  report: string;
  severity: number | null;
  bodyPart: string | null;
}

// TODO
export interface LessonSpecificData {
  data: PitchingLessonData | null; // Extend with other lesson types as needed
}

export interface PitchingLessonData {
  summary: string;
  focus: string;
}

/** Player data for lesson cards */
export interface LessonPlayerData {
  id: string;
  lessonPlayerId: string | null; // null for legacy lessons
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  position: string;
  throws: string;
  hits: string;
  sport: "baseball" | "softball";
  notes: string | null;
}

/** Coach data for lesson cards */
export interface LessonCoachData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

/** Complete lesson data structure for frontend components */
export interface LessonCardData {
  id: string;
  lessonType: "strength" | "hitting" | "pitching" | "fielding" | "catching";
  notes: string | null;
  createdOn: string;
  lessonDate: string;
  coach: LessonCoachData;
  /** Players in this lesson */
  players: LessonPlayerData[];
  /** Mechanics worked on during lesson */
  mechanics: LessonMechanicData[];
  /** Drills assigned during lesson */
  drills: LessonDrillData[];
  /** Whether this is a legacy lesson (no lesson_players records) */
  isLegacy: boolean;
}

/** Filter options for lesson queries */
export interface LessonQueryFilters {
  playerId?: string;
  coachId?: string;
  lessonType?: "strength" | "hitting" | "pitching" | "fielding" | "catching";
  limit?: number;
  offset?: number;
}

import { RoutineDocumentV1 } from "@/domain/routines/types";

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

export interface LessonAttachmentFileData {
  originalFileName: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  storageKey: string | null;
}

export interface LessonAttachmentData {
  id: string;
  lessonPlayerId: string;
  type:
    | "file_csv"
    | "file_video"
    | "file_image"
    | "file_pdf"
    | "file_docx"
    | "manual";
  source: string;
  evidenceCategory: string | null;
  visibility: "internal" | "private" | "public";
  documentType:
    | "medical"
    | "pt"
    | "external"
    | "eval"
    | "general"
    | "other"
    | null;
  notes: string | null;
  effectiveDate: string;
  createdAt: string;
  file: LessonAttachmentFileData | null;
}

export interface LessonFatigueData {
  id: string;
  report: string;
  severity: number | null;
  bodyPartId: string | null;
  bodyPart: string | null;
}

export interface StrengthTsIsoData {
  shoulderErL?: number | null;
  shoulderErR?: number | null;
  shoulderErTtpfL?: number | null;
  shoulderErTtpfR?: number | null;
  shoulderIrL?: number | null;
  shoulderIrR?: number | null;
  shoulderIrTtpfL?: number | null;
  shoulderIrTtpfR?: number | null;
  shoulderRotL?: number | null;
  shoulderRotR?: number | null;
  shoulderRotRfdL?: number | null;
  shoulderRotRfdR?: number | null;
  hipRotL?: number | null;
  hipRotR?: number | null;
  hipRotRfdL?: number | null;
  hipRotRfdR?: number | null;
}

export interface StrengthLessonData {
  tsIso: StrengthTsIsoData;
}

export interface PitchingLessonData {
  summary: string | null;
  focus: string | null;
}

export interface LessonPlayerSpecificData {
  pitching: PitchingLessonData | null;
  strength: StrengthLessonData | null;
}

export interface LessonPlayerRoutineData {
  id: string;
  sourceRoutineId: string;
  sourceRoutineSource: "player" | "universal";
  sourceRoutineType: "partial_lesson" | "full_lesson";
  sourceRoutineTitle: string;
  sourceRoutineDocument: RoutineDocumentV1;
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
  fatigueData: LessonFatigueData[];
  attachments: LessonAttachmentData[];
  appliedRoutines: LessonPlayerRoutineData[];
  lessonSpecific: LessonPlayerSpecificData;
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

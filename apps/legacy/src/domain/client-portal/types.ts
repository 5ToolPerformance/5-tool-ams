export type ClientPortalRole = "client";

export type ClientAccessiblePlayerSummary = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  sport: "baseball" | "softball";
  handedness: {
    hits: string;
    throws: string;
  };
  status: "active" | "limited";
};

export type ClientPortalProfile = {
  id: string;
  userId: string;
  facilityId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  onboardingComplete: boolean;
};

export type ClientPortalContext = {
  profile: ClientPortalProfile | null;
  players: ClientAccessiblePlayerSummary[];
  selectedPlayerId: string | null;
};

export type ClientLessonSummary = {
  id: string;
  lessonDate: string;
  lessonType: "strength" | "hitting" | "pitching" | "fielding" | "catching";
  coachName: string;
  summary: string;
};

export type ClientRoutineSummary = {
  id: string;
  title: string;
  description: string | null;
  routineType: "partial_lesson" | "full_lesson" | "progression";
  isActive: boolean;
};

export type ClientDevelopmentSummary = {
  id: string;
  disciplineLabel: string;
  status: "draft" | "active" | "completed" | "archived";
  summary: string | null;
  startDate: Date | null;
  targetEndDate: Date | null;
};

export type ClientHealthSummary = {
  activeInjuryCount: number;
  hasLimited: boolean;
  topConcern: string | null;
  latestArmCareScore: number | null;
  latestArmCareDate: string | null;
};

export type ClientPlayerProfile = {
  player: ClientAccessiblePlayerSummary;
  development: ClientDevelopmentSummary | null;
  routines: ClientRoutineSummary[];
  recentLessons: ClientLessonSummary[];
  health: ClientHealthSummary;
};

export type ClientPlayerAccess = {
  relationshipType: "parent" | "guardian" | "self" | "other";
  status: "active" | "revoked";
  permissions: {
    canView: boolean;
    canLogActivity: boolean;
    canUpload: boolean;
    canMessage: boolean;
  };
};

export type ClientInvitePreview = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  relationshipType: "parent" | "guardian" | "self" | "other";
  expiresAt: Date;
  status: "pending" | "accepted" | "expired" | "revoked";
  playerNames: string[];
};

export type AdminClientInviteListItem = ClientInvitePreview & {
  createdOn: Date;
};

export type CreateClientInviteInput = {
  facilityId: string;
  createdBy: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  relationshipType: "parent" | "guardian" | "self" | "other";
  playerIds: string[];
};

export type AcceptClientInviteInput = {
  token: string;
  userId: string;
};


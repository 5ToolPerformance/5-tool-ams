import { and, desc, eq, inArray } from "drizzle-orm";

import db from "@/db";
import {
  clientInvitePlayers,
  clientInvites,
  clientProfiles,
  developmentPlans,
  disciplines,
  playerClientAccess,
  playerInformation,
  userRoles,
  users,
} from "@/db/schema";
import { getLessonsByPlayerId } from "@/db/queries/lessons/lessonQueries";
import { getRoutinesForDevelopmentPlan } from "@/db/queries/routines/getRoutinesForDevelopmentPlan";
import {
  AcceptClientInviteInput,
  AdminClientInviteListItem,
  ClientInvitePreview,
  ClientPlayerAccess,
  ClientPlayerProfile,
  ClientPortalContext,
  ClientPortalProfile,
  CreateClientInviteInput,
} from "@/domain/client-portal/types";
import { calculateAge } from "@/lib/dates";
import { getHealthTabData } from "@/application/players/health/getHealthTabData";
import { hashClientInviteToken } from "@/lib/client-portal/tokens";
import {
  assertPortalInviteUserIsExternal,
  resolveClientInviteStatus,
  resolveSelectedPortalPlayerId,
} from "./helpers";

function getLessonSummary(lesson: Awaited<ReturnType<typeof getLessonsByPlayerId>>[number]) {
  const drillsCount = lesson.drills.length;
  const mechanicsCount = lesson.mechanics.length;
  const parts: string[] = [];

  if (mechanicsCount > 0) {
    parts.push(`${mechanicsCount} mechanic${mechanicsCount === 1 ? "" : "s"}`);
  }

  if (drillsCount > 0) {
    parts.push(`${drillsCount} drill${drillsCount === 1 ? "" : "s"}`);
  }

  if (parts.length === 0) {
    return `${lesson.lessonType} session completed`;
  }

  return `${lesson.lessonType} session covering ${parts.join(" and ")}`;
}

function summarizePlayer(row: {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sport: "baseball" | "softball";
  hits: string;
  throws: string;
}) {
  return {
    id: row.id,
    fullName: `${row.firstName} ${row.lastName}`,
    firstName: row.firstName,
    lastName: row.lastName,
    age: calculateAge(row.dateOfBirth),
    dateOfBirth: row.dateOfBirth,
    sport: row.sport,
    handedness: {
      hits: row.hits,
      throws: row.throws,
    },
    status: "active",
  } as const;
}

export async function getClientAccessForPlayer(
  userId: string,
  facilityId: string,
  playerId: string
): Promise<ClientPlayerAccess | null> {
  const [access] = await db
    .select({
      relationshipType: playerClientAccess.relationshipType,
      status: playerClientAccess.status,
      canView: playerClientAccess.canView,
      canLogActivity: playerClientAccess.canLogActivity,
      canUpload: playerClientAccess.canUpload,
      canMessage: playerClientAccess.canMessage,
    })
    .from(playerClientAccess)
    .where(
      and(
        eq(playerClientAccess.userId, userId),
        eq(playerClientAccess.facilityId, facilityId),
        eq(playerClientAccess.playerId, playerId)
      )
    )
    .limit(1);

  if (!access) {
    return null;
  }

  return {
    relationshipType: access.relationshipType,
    status: access.status,
    permissions: {
      canView: access.canView,
      canLogActivity: access.canLogActivity,
      canUpload: access.canUpload,
      canMessage: access.canMessage,
    },
  };
}

export async function getClientAccessiblePlayers(userId: string, facilityId: string) {
  const rows = await db
    .select({
      id: playerInformation.id,
      firstName: playerInformation.firstName,
      lastName: playerInformation.lastName,
      dateOfBirth: playerInformation.date_of_birth,
      sport: playerInformation.sport,
      hits: playerInformation.hits,
      throws: playerInformation.throws,
    })
    .from(playerClientAccess)
    .innerJoin(playerInformation, eq(playerClientAccess.playerId, playerInformation.id))
    .where(
      and(
        eq(playerClientAccess.userId, userId),
        eq(playerClientAccess.facilityId, facilityId),
        eq(playerClientAccess.status, "active"),
        eq(playerClientAccess.canView, true)
      )
    )
    .orderBy(playerInformation.lastName, playerInformation.firstName);

  return rows.map((row) => summarizePlayer(row));
}

export async function getClientPortalProfile(
  userId: string,
  facilityId: string
): Promise<ClientPortalProfile | null> {
  const [profile] = await db
    .select({
      id: clientProfiles.id,
      userId: clientProfiles.userId,
      facilityId: clientProfiles.facilityId,
      firstName: clientProfiles.firstName,
      lastName: clientProfiles.lastName,
      phone: clientProfiles.phone,
      onboardingComplete: clientProfiles.onboardingComplete,
    })
    .from(clientProfiles)
    .where(
      and(eq(clientProfiles.userId, userId), eq(clientProfiles.facilityId, facilityId))
    )
    .limit(1);

  return profile ?? null;
}

export async function getClientPortalContext(
  userId: string,
  facilityId: string,
  selectedPlayerId?: string | null
): Promise<ClientPortalContext> {
  const [profile, players] = await Promise.all([
    getClientPortalProfile(userId, facilityId),
    getClientAccessiblePlayers(userId, facilityId),
  ]);

  const selectedPlayer =
    players.find((player) => player.id === selectedPlayerId) ?? players[0] ?? null;

  return {
    profile,
    players,
    selectedPlayerId:
      resolveSelectedPortalPlayerId(
        players.map((player) => player.id),
        selectedPlayerId
      ) ?? selectedPlayer?.id ?? null,
  };
}

export async function getClientPlayerProfile(
  userId: string,
  facilityId: string,
  playerId: string
): Promise<ClientPlayerProfile | null> {
  const access = await getClientAccessForPlayer(userId, facilityId, playerId);
  if (!access || access.status !== "active" || !access.permissions.canView) {
    return null;
  }

  const [players, plans, lessonCards, health] = await Promise.all([
    getClientAccessiblePlayers(userId, facilityId),
    db
      .select({
        id: developmentPlans.id,
        disciplineLabel: disciplines.label,
        status: developmentPlans.status,
        startDate: developmentPlans.startDate,
        targetEndDate: developmentPlans.targetEndDate,
        documentData: developmentPlans.documentData,
      })
      .from(developmentPlans)
      .innerJoin(disciplines, eq(developmentPlans.disciplineId, disciplines.id))
      .where(eq(developmentPlans.playerId, playerId))
      .orderBy(desc(developmentPlans.createdOn))
      .limit(1),
    getLessonsByPlayerId(playerId, { limit: 3 }),
    getHealthTabData(playerId),
  ]);

  const player = players.find((item) => item.id === playerId);
  if (!player) {
    return null;
  }

  const development = plans[0]
    ? {
        id: plans[0].id,
        disciplineLabel: plans[0].disciplineLabel,
        status: plans[0].status,
        summary:
          typeof plans[0].documentData === "object" &&
          plans[0].documentData !== null &&
          "overview" in plans[0].documentData &&
          typeof (plans[0].documentData as { overview?: { summary?: unknown } }).overview
            ?.summary === "string"
            ? ((plans[0].documentData as { overview?: { summary?: string } }).overview
                ?.summary ?? null)
            : null,
        startDate: plans[0].startDate,
        targetEndDate: plans[0].targetEndDate,
      }
    : null;

  const routines = development
    ? await getRoutinesForDevelopmentPlan(db, development.id)
    : [];

  const activeInjuries = health.injuries.filter((injury) => injury.status !== "resolved");
  const topConcern =
    activeInjuries[0]?.focusArea ??
    activeInjuries[0]?.bodyPart ??
    null;

  return {
    player,
    development,
    routines: routines.slice(0, 4).map((routine) => ({
      id: routine.id,
      title: routine.title,
      description: routine.description,
      routineType: routine.routineType,
      isActive: routine.isActive,
    })),
    recentLessons: lessonCards.map((lesson) => ({
      id: lesson.id,
      lessonDate: lesson.lessonDate,
      lessonType: lesson.lessonType,
      coachName: lesson.coach.name ?? "Coaching staff",
      summary: getLessonSummary(lesson),
    })),
    health: {
      activeInjuryCount: activeInjuries.length,
      hasLimited: activeInjuries.some((injury) => injury.status === "limited"),
      topConcern,
      latestArmCareScore: health.armCare?.score ?? null,
      latestArmCareDate: health.armCare?.date ?? null,
    },
  };
}

export async function createClientPortalProfileIfNeeded(
  userId: string,
  facilityId: string,
  firstName: string | null,
  lastName: string | null
) {
  await db
    .insert(clientProfiles)
    .values({
      userId,
      facilityId,
      firstName,
      lastName,
      onboardingComplete: true,
    })
    .onConflictDoUpdate({
      target: [clientProfiles.userId, clientProfiles.facilityId],
      set: {
        firstName,
        lastName,
        onboardingComplete: true,
        updatedOn: new Date(),
      },
    });
}

export async function acceptClientInvite({ token, userId }: AcceptClientInviteInput) {
  const tokenHash = hashClientInviteToken(token);

  return db.transaction(async (tx) => {
    const [dbUser] = await tx
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!dbUser) {
      throw new Error("Portal user not found");
    }

    assertPortalInviteUserIsExternal(dbUser.role);

    const [invite] = await tx
      .select()
      .from(clientInvites)
      .where(eq(clientInvites.tokenHash, tokenHash))
      .limit(1);

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.status === "accepted" && invite.acceptedByUserId === userId) {
      return invite;
    }

    if (invite.status !== "pending") {
      throw new Error("Invite is not active");
    }

    if (new Date(invite.expiresAt) < new Date()) {
      await tx
        .update(clientInvites)
        .set({ status: "expired" })
        .where(eq(clientInvites.id, invite.id));
      throw new Error("Invite has expired");
    }

    if (invite.email.toLowerCase() !== dbUser.email.toLowerCase()) {
      throw new Error("Invite email does not match authenticated user");
    }

    await tx
      .insert(userRoles)
      .values({
        userId,
        facilityId: invite.facilityId,
        role: "client",
      })
      .onConflictDoNothing();

    await tx
      .insert(clientProfiles)
      .values({
        userId,
        facilityId: invite.facilityId,
        firstName: invite.firstName,
        lastName: invite.lastName,
        onboardingComplete: true,
      })
      .onConflictDoUpdate({
        target: [clientProfiles.userId, clientProfiles.facilityId],
        set: {
          firstName: invite.firstName,
          lastName: invite.lastName,
          onboardingComplete: true,
          updatedOn: new Date(),
        },
      });

    const invitePlayers = await tx
      .select({
        playerId: clientInvitePlayers.playerId,
      })
      .from(clientInvitePlayers)
      .where(eq(clientInvitePlayers.inviteId, invite.id));

    for (const invitePlayer of invitePlayers) {
      await tx
        .insert(playerClientAccess)
        .values({
          facilityId: invite.facilityId,
          playerId: invitePlayer.playerId,
          userId,
          relationshipType: invite.relationshipType,
          createdBy: invite.createdBy,
        })
        .onConflictDoUpdate({
          target: [playerClientAccess.playerId, playerClientAccess.userId],
          set: {
            facilityId: invite.facilityId,
            relationshipType: invite.relationshipType,
            status: "active",
            revokedOn: null,
            updatedOn: new Date(),
          },
        });
    }

    await tx
      .update(clientInvites)
      .set({
        status: "accepted",
        acceptedByUserId: userId,
        acceptedOn: new Date(),
      })
      .where(eq(clientInvites.id, invite.id));

    return invite;
  });
}

export async function getClientInvitePreviewByToken(token: string): Promise<ClientInvitePreview | null> {
  const tokenHash = hashClientInviteToken(token);
  const rows = await db
    .select({
      id: clientInvites.id,
      email: clientInvites.email,
      firstName: clientInvites.firstName,
      lastName: clientInvites.lastName,
      relationshipType: clientInvites.relationshipType,
      expiresAt: clientInvites.expiresAt,
      status: clientInvites.status,
      playerFirstName: playerInformation.firstName,
      playerLastName: playerInformation.lastName,
    })
    .from(clientInvites)
    .leftJoin(clientInvitePlayers, eq(clientInvitePlayers.inviteId, clientInvites.id))
    .leftJoin(playerInformation, eq(clientInvitePlayers.playerId, playerInformation.id))
    .where(eq(clientInvites.tokenHash, tokenHash));

  if (rows.length === 0) {
    return null;
  }

  const first = rows[0];
  return {
    id: first.id,
    email: first.email,
    firstName: first.firstName,
    lastName: first.lastName,
    relationshipType: first.relationshipType,
    expiresAt: first.expiresAt,
      status: resolveClientInviteStatus(first.status, new Date(first.expiresAt)),
    playerNames: rows
      .filter((row) => row.playerFirstName && row.playerLastName)
      .map((row) => `${row.playerFirstName} ${row.playerLastName}`),
  };
}

export async function listClientInvites(facilityId: string): Promise<AdminClientInviteListItem[]> {
  const rows = await db
    .select({
      id: clientInvites.id,
      email: clientInvites.email,
      firstName: clientInvites.firstName,
      lastName: clientInvites.lastName,
      relationshipType: clientInvites.relationshipType,
      status: clientInvites.status,
      expiresAt: clientInvites.expiresAt,
      createdOn: clientInvites.createdOn,
      playerFirstName: playerInformation.firstName,
      playerLastName: playerInformation.lastName,
    })
    .from(clientInvites)
    .leftJoin(clientInvitePlayers, eq(clientInvitePlayers.inviteId, clientInvites.id))
    .leftJoin(playerInformation, eq(clientInvitePlayers.playerId, playerInformation.id))
    .where(eq(clientInvites.facilityId, facilityId))
    .orderBy(desc(clientInvites.createdOn));

  const grouped = new Map<string, AdminClientInviteListItem>();

  for (const row of rows) {
    const existing = grouped.get(row.id);
    const playerName =
      row.playerFirstName && row.playerLastName
        ? `${row.playerFirstName} ${row.playerLastName}`
        : null;

    if (existing) {
      if (playerName) {
        existing.playerNames.push(playerName);
      }
      continue;
    }

    grouped.set(row.id, {
      id: row.id,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      relationshipType: row.relationshipType,
      status: resolveClientInviteStatus(row.status, new Date(row.expiresAt)),
      expiresAt: row.expiresAt,
      createdOn: row.createdOn,
      playerNames: playerName ? [playerName] : [],
    });
  }

  return Array.from(grouped.values());
}

export async function createClientInvite(input: CreateClientInviteInput & { tokenHash: string }) {
  const email = input.email.toLowerCase();

  return db.transaction(async (tx) => {
    const [existingUser] = await tx
      .select({
        id: users.id,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser?.role) {
      throw new Error("This email already belongs to an internal account");
    }

    let userId = existingUser?.id;

    if (!userId) {
      const [createdUser] = await tx
        .insert(users)
        .values({
          email,
          role: null,
          facilityId: input.facilityId,
          isActive: true,
        })
        .returning({ id: users.id });

      userId = createdUser.id;
    } else {
      await tx
        .update(users)
        .set({
          facilityId: input.facilityId,
          isActive: true,
        })
        .where(eq(users.id, userId));
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [invite] = await tx
      .insert(clientInvites)
      .values({
        facilityId: input.facilityId,
        email,
        firstName: input.firstName,
        lastName: input.lastName,
        relationshipType: input.relationshipType,
        tokenHash: input.tokenHash,
        expiresAt,
        createdBy: input.createdBy,
      })
      .returning({
        id: clientInvites.id,
        expiresAt: clientInvites.expiresAt,
      });

    if (input.playerIds.length > 0) {
      await tx.insert(clientInvitePlayers).values(
        input.playerIds.map((playerId) => ({
          inviteId: invite.id,
          playerId,
        }))
      );
    }

    return invite;
  });
}

export async function getPortalInvitePlayerNames(playerIds: string[]) {
  if (playerIds.length === 0) {
    return [];
  }

  const rows = await db
    .select({
      id: playerInformation.id,
      firstName: playerInformation.firstName,
      lastName: playerInformation.lastName,
    })
    .from(playerInformation)
    .where(inArray(playerInformation.id, playerIds));

  return rows.map((row) => `${row.firstName} ${row.lastName}`);
}

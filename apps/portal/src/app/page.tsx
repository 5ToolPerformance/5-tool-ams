import { redirect } from "next/navigation";
import Link from "next/link";

import { Card, CardBody, Chip } from "@heroui/react";

import {
  acceptPendingClientInvitesForUser,
  getClientPlayerProfile,
  getClientPortalContext,
} from "@ams/application/client-portal/service";
import { auth } from "@/auth";
import { getOptionalClientAuthContext } from "@/application/auth/client-auth";
import { formatDateShort } from "@/utils/dates";
import { PortalMagicLinkCard } from "@/ui/features/client-portal/PortalMagicLinkCard";
import { PortalPlayerSwitcher } from "@/ui/features/client-portal/PortalPlayerSwitcher";

export const dynamic = "force-dynamic";

export default async function PortalHomePage({
  searchParams,
}: {
  searchParams: Promise<{ playerId?: string }>;
}) {
  const ctx = await getOptionalClientAuthContext();
  const session = await auth();

  if (!ctx) {
    if (
      session?.user?.id &&
      session.user.email &&
      !session.user.role
    ) {
      const acceptedCount = await acceptPendingClientInvitesForUser(session.user.id);

      if (acceptedCount > 0) {
        redirect("/");
      }
    }

    if (session?.user?.role) {
      return (
        <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
          <Card className="w-full border border-white/50 bg-white/85 dark:border-white/10 dark:bg-default-100/70">
            <CardBody className="space-y-2 p-5">
              <h1 className="text-2xl font-semibold">Portal access denied</h1>
              <p className="text-sm text-default-500">
                Internal staff accounts cannot access the family portal.
              </p>
            </CardBody>
          </Card>
        </div>
      );
    }

    if (session?.user?.id) {
      return (
        <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
          <Card className="w-full border border-white/50 bg-white/85 dark:border-white/10 dark:bg-default-100/70">
            <CardBody className="space-y-2 p-5">
              <h1 className="text-2xl font-semibold">Portal access pending</h1>
              <p className="text-sm text-default-500">
                Your sign-in worked, but there is no active portal invite linked to this email yet.
              </p>
            </CardBody>
          </Card>
        </div>
      );
    }

    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
        <PortalMagicLinkCard />
      </div>
    );
  }

  const { playerId } = await searchParams;
  const portalContext = await getClientPortalContext(ctx.userId, ctx.facilityId, playerId);

  if (!portalContext.selectedPlayerId) {
    return (
      <div className="mx-auto max-w-md px-4 py-6">
        <Card className="border border-white/50 bg-white/85 dark:border-white/10 dark:bg-default-100/70">
          <CardBody className="space-y-2 p-5">
            <h1 className="text-xl font-semibold">Client portal</h1>
            <p className="text-sm text-default-500">
              Your account is signed in, but no players are linked yet.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const profile = await getClientPlayerProfile(
    ctx.userId,
    ctx.facilityId,
    portalContext.selectedPlayerId
  );

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-5">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-default-500">
            Family Portal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Player profile</h1>
        </div>

        <PortalPlayerSwitcher
          players={portalContext.players}
          selectedPlayerId={portalContext.selectedPlayerId}
        />
      </div>

      <Card className="overflow-hidden border-none bg-foreground text-background shadow-2xl shadow-black/10">
        <CardBody className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold">{profile.player.fullName}</p>
              <p className="text-sm text-background/70">
                Age {profile.player.age} • {profile.player.sport}
              </p>
            </div>
            <Chip variant="flat" className="bg-white/10 text-white">
              {profile.player.status}
            </Chip>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-background/75">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs uppercase tracking-wide text-background/60">Hits</p>
              <p className="mt-1 font-medium capitalize">{profile.player.handedness.hits}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs uppercase tracking-wide text-background/60">Throws</p>
              <p className="mt-1 font-medium capitalize">{profile.player.handedness.throws}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-white/50 bg-white/85 dark:border-white/10 dark:bg-default-100/70">
        <CardBody className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Development plan</h2>
            {profile.development ? (
              <Chip color="primary" variant="flat">
                {profile.development.status}
              </Chip>
            ) : null}
          </div>
          {profile.development ? (
            <>
              <p className="text-sm font-medium">{profile.development.disciplineLabel}</p>
              <p className="text-sm text-default-500">
                {profile.development.summary ?? "Current plan is active and available in the portal."}
              </p>
            </>
          ) : (
            <p className="text-sm text-default-500">
              No active development summary is available yet.
            </p>
          )}
        </CardBody>
      </Card>

      <Card className="border border-white/50 bg-white/85 dark:border-white/10 dark:bg-default-100/70">
        <CardBody className="space-y-3 p-5">
          <h2 className="text-lg font-semibold">Recent lessons</h2>
          {profile.recentLessons.length > 0 ? (
            <div className="space-y-3">
              {profile.recentLessons.map((lesson) => (
                <div key={lesson.id} className="rounded-2xl bg-default-50 p-3 dark:bg-default-200/10">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium capitalize">{lesson.lessonType}</p>
                    <p className="text-xs text-default-500">{formatDateShort(lesson.lessonDate)}</p>
                  </div>
                  <p className="mt-2 text-sm text-default-600">{lesson.summary}</p>
                  <p className="mt-2 text-xs text-default-500">Coach: {lesson.coachName}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-default-500">Lesson summaries will appear here.</p>
          )}
        </CardBody>
      </Card>

      <Card className="border border-white/50 bg-white/85 dark:border-white/10 dark:bg-default-100/70">
        <CardBody className="space-y-3 p-5">
          <h2 className="text-lg font-semibold">Current work</h2>
          {profile.routines.length > 0 ? (
            <div className="space-y-3">
              {profile.routines.map((routine) => (
                <div key={routine.id} className="rounded-2xl border border-default-100 p-3 dark:border-default-100/10">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{routine.title}</p>
                    <Chip size="sm" variant="flat">
                      {routine.routineType.replace("_", " ")}
                    </Chip>
                  </div>
                  <p className="mt-2 text-sm text-default-500">
                    {routine.description ?? "Routine details will expand here in a future update."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-default-500">Assigned routines will appear here.</p>
          )}
        </CardBody>
      </Card>

      <Card className="border border-white/50 bg-white/85 dark:border-white/10 dark:bg-default-100/70">
        <CardBody className="space-y-3 p-5">
          <h2 className="text-lg font-semibold">Health snapshot</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-default-50 p-3 dark:bg-default-200/10">
              <p className="text-xs uppercase tracking-wide text-default-500">Active concerns</p>
              <p className="mt-1 text-2xl font-semibold">{profile.health.activeInjuryCount}</p>
            </div>
            <div className="rounded-2xl bg-default-50 p-3 dark:bg-default-200/10">
              <p className="text-xs uppercase tracking-wide text-default-500">Latest ArmCare</p>
              <p className="mt-1 text-2xl font-semibold">
                {profile.health.latestArmCareScore ?? "--"}
              </p>
            </div>
          </div>
          <p className="text-sm text-default-500">
            {profile.health.topConcern
              ? `Current top concern: ${profile.health.topConcern}`
              : "No active health concerns are visible in the portal."}
          </p>
        </CardBody>
      </Card>

      <Link href={`/assistant?playerId=${profile.player.id}`}>
        <Card className="border border-amber-300/50 bg-amber-50/80 shadow-lg shadow-amber-500/5 dark:border-amber-200/10 dark:bg-amber-500/10">
          <CardBody className="space-y-1 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
              Coming next
            </p>
            <p className="text-xl font-semibold">Parent AI assistant</p>
            <p className="text-sm text-default-600 dark:text-default-400">
              Ask development questions, review routines, and stay aligned with your player's current work.
            </p>
          </CardBody>
        </Card>
      </Link>
    </div>
  );
}

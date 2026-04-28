import { notFound, redirect } from "next/navigation";

import { Card, CardBody, Chip } from "@heroui/react";

import {
  acceptClientInvite,
  getClientInvitePreviewByToken,
} from "@ams/application/client-portal/service";
import { getOptionalClientAuthContext } from "@/application/auth/client-auth";
import { formatDateShort } from "@/utils/dates";
import { PortalMagicLinkCard } from "@/ui/features/client-portal/PortalMagicLinkCard";

export const dynamic = "force-dynamic";

export default async function PortalInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getClientInvitePreviewByToken(token);

  if (!invite) {
    notFound();
  }

  const authContext = await getOptionalClientAuthContext();

  if (authContext) {
    await acceptClientInvite({
      token,
      userId: authContext.userId,
    });
    redirect("/portal");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
      <div className="w-full space-y-4">
        <Card className="border border-white/50 bg-white/85 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-default-100/70">
          <CardBody className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-default-500">
                  Portal Invite
                </p>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {invite.firstName ? `Welcome, ${invite.firstName}` : "You're invited"}
                </h1>
              </div>
              <Chip color={invite.status === "pending" ? "primary" : "default"} variant="flat">
                {invite.status}
              </Chip>
            </div>
            <p className="text-sm text-default-500">
              This invite gives you access to {invite.playerNames.join(", ")}.
            </p>
            <p className="text-sm text-default-500">
              Invite expires {formatDateShort(invite.expiresAt)}.
            </p>
          </CardBody>
        </Card>

        <PortalMagicLinkCard
          email={invite.email}
          readOnly
          callbackUrl={`/portal/invite/${token}`}
          title="Secure portal sign-in"
          description="We'll send a magic link to the invited email address so you can accept access securely."
        />
      </div>
    </div>
  );
}

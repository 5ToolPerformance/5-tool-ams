import { Card, CardBody } from "@heroui/react";

import { getClientPortalContext } from "@/application/client-portal/service";
import { requireClientPortalAccess } from "@/application/auth/client-auth";
import { ThemeSwitcher } from "@/ui/core/layout/ThemeSwitcher";
import { PortalSignOutButton } from "@/ui/features/client-portal/PortalSignOutButton";

export const dynamic = "force-dynamic";

export default async function PortalSettingsPage() {
  const authContext = await requireClientPortalAccess();
  const context = await getClientPortalContext(authContext.userId, authContext.facilityId);

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-5">
      <Card className="border border-white/50 bg-white/85 dark:border-white/10 dark:bg-default-100/70">
        <CardBody className="space-y-4 p-5">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-default-500">
              Manage your portal preferences and account access.
            </p>
          </div>

          <div className="rounded-2xl bg-default-50 p-4 dark:bg-default-200/10">
            <p className="text-xs uppercase tracking-wide text-default-500">Account</p>
            <p className="mt-1 font-medium">{authContext.email}</p>
            <p className="text-sm text-default-500">
              {context.profile?.firstName || context.profile?.lastName
                ? `${context.profile?.firstName ?? ""} ${context.profile?.lastName ?? ""}`.trim()
                : "Client portal user"}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-default-50 p-4 dark:bg-default-200/10">
            <div>
              <p className="font-medium">Appearance</p>
              <p className="text-sm text-default-500">Switch between light and dark mode.</p>
            </div>
            <ThemeSwitcher />
          </div>

          <PortalSignOutButton />
        </CardBody>
      </Card>
    </div>
  );
}


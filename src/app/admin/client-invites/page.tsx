import { getAuthContext, requireRole } from "@/application/auth/auth-context";
import { ClientInvitesAdminPageClient } from "@/ui/features/client-portal/ClientInvitesAdminPageClient";

export default async function ClientInvitesAdminPage() {
  const ctx = await getAuthContext();
  requireRole(ctx, ["admin"]);

  return <ClientInvitesAdminPageClient />;
}

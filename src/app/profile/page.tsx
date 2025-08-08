import { Card, CardBody, User } from "@heroui/react";

import { auth } from "@/auth";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import CoachDashboard from "@/components/dashboards/CoachDashboard";
import requireAuth from "@/utils/require-auth";

export default async function Profile() {
  await requireAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Profile not found</div>;
  }

  if (session?.user?.role === "coach") {
    return <CoachDashboard coachId={session.user.id} />;
  }

  if (session?.user?.role === "admin") {
    return <AdminDashboard adminId={session.user.id} />;
  }

  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-md">
        <CardBody>
          <User
            name={session?.user?.name}
            description={session?.user?.email}
            avatarProps={{
              showFallback: !session?.user?.image,
              src: session?.user?.image || "",
            }}
          />
          <div className="mt-4">
            <h2 className="text-lg font-semibold">User Information</h2>
            <p className="mt-2 text-sm text-gray-600">
              Name: {session?.user?.name}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Email: {session?.user?.email}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Role: {session?.user?.role}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              ID: {session?.user?.id}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export const dynamic = "force-dynamic";

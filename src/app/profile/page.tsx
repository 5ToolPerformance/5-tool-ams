import { Card, CardBody, User } from "@heroui/react";
import { getServerSession } from "next-auth";

import ArmCareClient from "@/components/assessments/ArmCareClient";
import options from "@/config/auth";
import requireAuth from "@/utils/require-auth";

export default async function Profile() {
  await requireAuth();
  const session = await getServerSession(options);
  const assessmentId = "361e33ce-4c0c-461c-a61e-7c3917ad1cea";
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
      
      <div className="max-w-4xl mx-auto">
        <ArmCareClient assessmentId={assessmentId} />
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

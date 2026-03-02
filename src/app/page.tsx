import { redirect } from "next/navigation";

import { Card, CardBody } from "@heroui/react";

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (!session) {
    return (
      <Card className="mx-auto mt-4 max-w-md">
        <CardBody className="text-center">
          <h1 className="text-5xl">5 Tool Performance</h1>
          <p className="text-xl">Athlete Management System</p>
        </CardBody>
      </Card>
    );
  }

  if (session.user?.role === "admin") {
    redirect("/dashboard/overview");
  }

  if (session.user?.role === "coach" && session.user?.id) {
    redirect(`/coaches/${session.user.id}`);
  }

  if (session.user?.role === "player" && session.user?.playerId) {
    redirect(`/players/${session.user.playerId}/overview`);
  }

  return (
    <Card className="mx-auto mt-4 max-w-md">
      <CardBody className="text-center">
        <p className="text-base">Unable to resolve home destination for this account.</p>
      </CardBody>
    </Card>
  );
}

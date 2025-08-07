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

  redirect("/profile");
}

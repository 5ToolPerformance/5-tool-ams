"use client";

import { Card, CardBody, CircularProgress } from "@heroui/react";

import { useAllLessons, useUserById } from "@/hooks";

type Props = {
  adminId: string;
};

export default function AdminDashboard({ adminId }: Props) {
  const {
    data: admin,
    isLoading: adminLoading,
    error: adminError,
  } = useUserById(adminId);

  const {
    data: lessons,
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useAllLessons();

  if (adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (adminError) {
    return (
      <Card className="mx-auto mt-8 max-w-4xl">
        <CardBody>
          <p className="text-danger">Error: {adminError?.message}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>{admin?.name}</p>
      {lessonsLoading && <p>Loading lessons...</p>}
      {lessonsError && <p>Error: {lessonsError?.message}</p>}
      {lessons && <p>{lessons.length}</p>}
    </div>
  );
}

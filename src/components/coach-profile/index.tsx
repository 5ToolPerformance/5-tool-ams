"use client";

import { Card, CardBody, CardHeader, Chip, Divider, User } from "@heroui/react";

import { useLessonsByCoachId } from "@/hooks/lessons";
import { useUserById } from "@/hooks/players";

import LessonCard from "../lessons/lessonCard";

export default function CoachProfile({ coachId }: { coachId: string }) {
  const {
    data: coach,
    isLoading: coachLoading,
    error: coachError,
  } = useUserById(coachId);
  const {
    data: lessons,
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useLessonsByCoachId(coachId);

  if (coachLoading || lessonsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-default-500">Loading...</div>
      </div>
    );
  }

  if (coachError || lessonsError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-red-500">
          Error: {coachError?.message || lessonsError?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Coach Information Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <User
              name={coach?.name}
              description={coach?.email}
              avatarProps={{
                showFallback: !coach?.image,
                src: coach?.image || "",
                size: "lg",
              }}
              classNames={{
                name: "text-xl font-semibold",
                description: "text-default-600",
              }}
            />
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Chip color="primary" variant="flat">
              Director of Health and Fitness
            </Chip>
            <Chip color="secondary" variant="flat">
              Strength Coach
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* Statistics Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-semibold">Coach Statistics</h2>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-default-50 p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {lessons?.length || 0}
              </div>
              <div className="text-sm text-default-600">Total Lessons</div>
            </div>
            <div className="rounded-lg bg-default-50 p-4 text-center">
              <div className="text-2xl font-bold text-secondary">XX</div>
              <div className="text-sm text-default-600">
                Assessments Completed
              </div>
            </div>
            <div className="rounded-lg bg-default-50 p-4 text-center">
              <div className="text-2xl font-bold text-success">XX</div>
              <div className="text-sm text-default-600">Clients</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Lessons Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Lessons</h2>
            <Chip size="sm" variant="flat">
              {lessons?.length || 0} lessons
            </Chip>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          {lessons?.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-2 text-4xl text-default-400">📚</div>
                <p className="text-default-500">
                  No lessons found for this coach.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-h-[600px] space-y-4 overflow-y-auto p-6">
              {lessons.map((lessonItem) => (
                <LessonCard key={lessonItem.lesson.id} lesson={lessonItem} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
} from "@heroui/react";

import { useLessonsByCoachId, useUserById } from "@/hooks";
import { CoachesService } from "@/lib/services/coaches";
import { DateTimeService } from "@/lib/services/date-time";
import { StringService } from "@/lib/services/strings";
import { LessonWithCoachAndUser } from "@/types/lessons";

type Props = {
  coachId: string;
};

export default function CoachDashboard({ coachId }: Props) {
  const {
    data: coach,
    isLoading: coachLoading,
    error: coachError,
  } = useUserById(coachId);

  const {
    data: lessonsInformation,
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useLessonsByCoachId(coachId);

  if (coachLoading || lessonsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (coachError || lessonsError) {
    return (
      <Card className="mx-auto mt-8 max-w-4xl">
        <CardBody>
          <p className="text-danger">Error: {coachError?.message}</p>
        </CardBody>
      </Card>
    );
  }
  const lessons = lessonsInformation.lesson;
  console.log("Lessons: ", lessonsInformation);

  // Calculate summary statistics
  const totalLessons = CoachesService.countLessons(lessonsInformation);
  const totalPlayers = CoachesService.countPlayers(lessonsInformation);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Section 1: Coach Profile Card */}
      <Card className="w-full">
        <CardBody className="flex flex-row items-center gap-6 p-8">
          <Avatar
            src={coach?.image || ""}
            className="h-24 w-24 text-large"
            name={coach?.name || "Coach"}
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">
              {coach?.name || "Coach Name"}
            </h1>
            <p className="text-lg text-default-500">Pitching Coach</p>
            <div className="mt-2 flex gap-2">
              <Chip color="primary" variant="flat">
                Active
              </Chip>
              <Chip color="success" variant="flat">
                Certified
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Section 2: Summary Section */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <h2 className="text-2xl font-semibold">Coaching Summary</h2>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-primary-50 p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                {totalLessons}
              </div>
              <div className="mt-1 text-sm text-default-600">Total Lessons</div>
            </div>
            <div className="rounded-lg bg-success-50 p-4 text-center">
              <div className="text-3xl font-bold text-success">
                {totalPlayers}
              </div>
              <div className="mt-1 text-sm text-default-600">
                Students Coached
              </div>
            </div>
            <div className="rounded-lg bg-warning-50 p-4 text-center">
              <div className="text-3xl font-bold text-warning">N/A</div>
              <div className="mt-1 text-sm text-default-600">Total Hours</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Section 3: Lessons Section */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Lessons</h2>
            <Button color="primary" variant="flat" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="space-y-4">
            {lessonsInformation.map(
              (lesson: LessonWithCoachAndUser, index: number) => (
                <div key={lesson.lesson.id}>
                  <div className="flex items-start justify-between rounded-lg p-4 transition-colors hover:bg-default-50">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {lesson.player.firstName} {lesson.player.lastName}
                      </h3>
                      <p className="text-sm text-default-500">
                        {lesson.lesson.notes ||
                          "No additional notes were provided"}
                      </p>
                      <div className="mt-2 flex gap-4 text-sm text-default-600">
                        <span>
                          📅{" "}
                          {DateTimeService.formatLessonDate(
                            lesson.lesson.lessonDate
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Chip color="primary" variant="flat" size="sm">
                        {StringService.formatLessonType(
                          lesson.lesson.lessonType
                        )}
                      </Chip>
                      <a href={`/lessons/${lesson.lesson.id}`}>
                        <Button size="sm" variant="light">
                          View Details
                        </Button>
                      </a>
                    </div>
                  </div>
                  {index < lessonsInformation.length - 1 && <Divider />}
                </div>
              )
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Skeleton,
} from "@heroui/react";

import { useLessonById } from "@/hooks";
import { DateTimeService } from "@/lib/services/date-time";
import { StringService } from "@/lib/services/strings";

type LessonPageProps = {
  lessonId: string;
};

export function LessonPageComponent({ lessonId }: LessonPageProps) {
  const { data: lesson, error, isLoading } = useLessonById(lessonId);

  if (isLoading) {
    return (
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 rounded-lg" />
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-6 w-5/6 rounded-lg" />
            <Skeleton className="h-6 w-4/6 rounded-lg" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader className="flex items-center justify-between">
          Error
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            <p>{error.message}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lesson</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-4">
          <p>{StringService.formatLessonType(lesson.lessonType)}</p>
          <p>{DateTimeService.formatLessonDate(lesson.lessonDate)}</p>
          <p>{lesson.lessonNotes}</p>
          <div className="flex flex-wrap gap-2">
            {lesson.assessments.map(
              (assessment: { assessmentType: string }, index: number) => (
                <Button variant="flat" key={index}>
                  {StringService.formatLessonType(assessment.assessmentType)}
                </Button>
              )
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

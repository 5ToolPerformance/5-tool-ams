"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Skeleton,
} from "@heroui/react";

import { useAssessmentsByLessonId, useLessonById } from "@/hooks";
import { DateTimeService } from "@/lib/services/date-time";
import { StringService } from "@/lib/services/strings";

import ArmCareViewer from "../assessments/ArmCareViewer";
import ForcePlateViewer from "../assessments/ForcePlateViewer";
import HitTraxViewer from "../assessments/HitTraxViewer";
import PitchingAssessmentViewer from "../assessments/PitchingAssessmentViewer";
import SmfaViewer from "../assessments/SmfaViewer";
import TrueStrengthViewer from "../assessments/TrueStrengthViewer";
import VeloViewer from "../assessments/VeloViewer";
import FormattedText from "../ui/formattedText";

type LessonPageProps = {
  lessonId: string;
};

export function LessonPageComponent({ lessonId }: LessonPageProps) {
  const { data: lesson, error, isLoading } = useLessonById(lessonId);
  const {
    data: assessments,
    error: assessError,
    isLoading: assessLoading,
  } = useAssessmentsByLessonId(lessonId);

  if (isLoading || assessLoading) {
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

  if (error || assessError) {
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
          <p>{lesson.coach.name}</p>
          <FormattedText text={lesson.notes} />
          <div className="flex flex-wrap gap-2">
            {lesson.assessments.map(
              (assessment: { assessmentType: string }, index: number) => (
                <Button variant="flat" key={index}>
                  {StringService.formatLessonType(assessment.assessmentType)}
                </Button>
              )
            )}
          </div>
          {assessments?.map((item: { lessonType: string; data: unknown }) => {
            if (item.lessonType === "arm_care") {
              return (
                <ArmCareViewer
                  key={(item.data as any)?.id ?? Math.random()}
                  data={item.data as any}
                />
              );
            }
            if (item.lessonType === "smfa") {
              return (
                <SmfaViewer
                  key={(item.data as any)?.id ?? Math.random()}
                  data={item.data as any}
                />
              );
            }
            if (item.lessonType === "force_plate") {
              return (
                <ForcePlateViewer
                  key={(item.data as any)?.id ?? Math.random()}
                  data={item.data as any}
                />
              );
            }
            if (item.lessonType === "true_strength") {
              return (
                <TrueStrengthViewer
                  key={(item.data as any)?.id ?? Math.random()}
                  data={item.data as any}
                />
              );
            }
            if (item.lessonType === "pitching_assessment") {
              return (
                <PitchingAssessmentViewer
                  key={(item.data as any)?.id ?? Math.random()}
                  data={item.data as any}
                />
              );
            }
            if (item.lessonType === "velo_assessment") {
              return (
                <VeloViewer
                  key={(item.data as any)?.id ?? Math.random()}
                  data={item.data as any}
                />
              );
            }
            if (item.lessonType === "hit_trax_assessment") {
              return (
                <HitTraxViewer
                  key={(item.data as any)?.id ?? Math.random()}
                  data={item.data as any}
                />
              );
            }
            return null;
          })}
        </div>
      </CardBody>
    </Card>
  );
}

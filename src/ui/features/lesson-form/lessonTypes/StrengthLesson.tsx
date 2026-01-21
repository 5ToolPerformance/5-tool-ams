"use client";

import { TsIsoData } from "@/hooks/lessons/lessonForm.types";
import { useLessonFormContext } from "@/ui/features/lesson-form/LessonFormProvider";
import { TsIsoTable } from "@/ui/features/lesson-form/components/TsIsoTable";

import { LessonTypeImplementation } from "./lessonTypes";

type Row = {
  key: string;
  label: string;
  leftKey: keyof TsIsoData;
  rightKey: keyof TsIsoData;
};

const ROWS: Row[] = [
  {
    key: "shoulderEr",
    label: "Shoulder ER",
    leftKey: "shoulderErL",
    rightKey: "shoulderErR",
  },
  {
    key: "shoulderErTtpf",
    label: "Shoulder ER TTPF",
    leftKey: "shoulderErTtpfL",
    rightKey: "shoulderErTtpfR",
  },
  {
    key: "shoulderIr",
    label: "Shoulder IR",
    leftKey: "shoulderIrL",
    rightKey: "shoulderIrR",
  },
  {
    key: "shoulderIrTtpf",
    label: "Shoulder IR TTPF",
    leftKey: "shoulderIrTtpfL",
    rightKey: "shoulderIrTtpfR",
  },
  {
    key: "shoulderRot",
    label: "Shoulder Rotation",
    leftKey: "shoulderRotL",
    rightKey: "shoulderRotR",
  },
  {
    key: "shoulderRotRfd",
    label: "Shoulder Rotation RFD",
    leftKey: "shoulderRotRfdL",
    rightKey: "shoulderRotRfdR",
  },
  {
    key: "hipRot",
    label: "Hip Rotation",
    leftKey: "hipRotL",
    rightKey: "hipRotR",
  },
  {
    key: "hipRotRfd",
    label: "Hip Rotation RFD",
    leftKey: "hipRotRfdL",
    rightKey: "hipRotRfdR",
  },
];

export const StrengthLesson: LessonTypeImplementation = {
  type: "strength",
  label: "Strength",

  // Used for mechanics filtering
  allowedMechanicTypes: [],

  PlayerNotes({ playerId, data }) {
    const { form } = useLessonFormContext();

    return <TsIsoTable playerId={playerId} data={data || {}} />;
  },
};

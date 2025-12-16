"use client";

import { Chip, Divider } from "@heroui/react";
import { format, parseISO } from "date-fns";

import { ArmCareSelect, ForcePlateSelect } from "@/types/database";

interface FormattedReportProps {
  data: any; // We'll use the data structure from your API
}

export function FormattedReport({ data }: FormattedReportProps) {
  const player = data.player[0]?.player;

  if (!player) {
    return <div>No player data found</div>;
  }

  const age =
    new Date().getFullYear() - new Date(player.date_of_birth).getFullYear();
  const heightFeet = Math.floor(player.height / 12);
  const heightInches = player.height % 12;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Player Header - Print Friendly */}
      <div className="rounded-lg border border-default-200 bg-content1 p-6 shadow-sm print:border-0 print:bg-white">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {player.firstName} {player.lastName}
            </h2>
            <div className="mt-2 flex gap-3 text-sm text-default-600">
              <span>{player.position}</span>
              <span>•</span>
              <span>
                {player.throws}HP / {player.hits}HB
              </span>
              <span>•</span>
              <span>Age {age}</span>
            </div>
          </div>
          <Chip
            size="sm"
            variant="flat"
            className="print:border print:border-gray-300"
          >
            {data.lessonsWithAssessments.length} Lessons
          </Chip>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-default-500">DOB:</span>{" "}
            <span className="font-medium">
              {format(parseISO(player.date_of_birth), "MM/dd/yyyy")}
            </span>
          </div>
          <div>
            <span className="text-default-500">Height:</span>{" "}
            <span className="font-medium">
              {heightFeet}&rsquo;{heightInches}&quot;
            </span>
          </div>
          <div>
            <span className="text-default-500">Weight:</span>{" "}
            <span className="font-medium">{player.weight} lbs</span>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-4">
        {data.lessonsWithAssessments.map((lesson: any) => (
          <div
            key={lesson.lessonId}
            className="rounded-lg border border-default-200 bg-content1 p-6 shadow-sm print:break-inside-avoid print:border print:bg-white"
          >
            {/* Lesson Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Chip
                  size="sm"
                  color="primary"
                  variant="flat"
                  className="print:border print:border-blue-300"
                >
                  {format(parseISO(lesson.lessonDate), "MMM dd, yyyy")}
                </Chip>
                <Chip
                  size="sm"
                  variant="bordered"
                  className="print:!border-gray-300 print:!bg-white print:!text-black"
                >
                  <span className="print:!text-black">{lesson.lessonType}</span>
                </Chip>
              </div>
              <p className="text-sm text-default-500">
                Coach: {lesson.coachName}
              </p>
            </div>

            {/* Lesson Notes */}
            {lesson.lessonNotes && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold">Notes:</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-default-700">
                  {lesson.lessonNotes}
                </p>
              </div>
            )}

            {/* Assessments */}
            {lesson.assessments.length > 0 && (
              <>
                <Divider className="my-4" />
                <div className="space-y-4">
                  <p className="text-sm font-semibold">Assessments:</p>
                  {lesson.assessments.map(
                    (assessment: any, assessmentIndex: number) => (
                      <AssessmentDisplay
                        key={assessmentIndex}
                        assessment={assessment}
                      />
                    )
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Assessment Display Components
function AssessmentDisplay({ assessment }: { assessment: any }) {
  const getTitle = () => {
    switch (assessment.assessmentType) {
      case "arm_care":
        return "Arm Care Assessment";
      case "force_plate":
        return "Force Plate Assessment";
      case "true_strength":
        return "True Strength Assessment";
      default:
        return "Assessment";
    }
  };

  const renderContent = () => {
    switch (assessment.assessmentType) {
      case "arm_care":
        return <ArmCareDisplay data={assessment.data} />;
      case "force_plate":
        return <ForcePlateDisplay data={assessment.data} />;
      case "true_strength":
        return <TrueStrengthDisplay data={assessment.data} />;
      default:
        return (
          <pre className="text-xs">
            {JSON.stringify(assessment.data, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="rounded-lg border border-default-100 bg-content2 p-4 shadow-sm print:bg-gray-50">
      <h4 className="mb-3 text-sm font-semibold">{getTitle()}</h4>
      {renderContent()}
    </div>
  );
}

function ArmCareDisplay({ data }: { data: Partial<ArmCareSelect> }) {
  const metrics = [
    {
      label: "Shoulder ER",
      left: data.shoulder_er_l,
      right: data.shoulder_er_r,
      unit: "°",
    },
    {
      label: "Shoulder IR",
      left: data.shoulder_ir_l,
      right: data.shoulder_ir_r,
      unit: "°",
    },
    {
      label: "Shoulder Flexion",
      left: data.shoulder_flexion_l,
      right: data.shoulder_flexion_r,
      unit: "°",
    },
    {
      label: "Hip ER",
      left: data.supine_hip_er_l,
      right: data.supine_hip_er_r,
      unit: "°",
    },
    {
      label: "Hip IR",
      left: data.supine_hip_ir_l,
      right: data.supine_hip_ir_r,
      unit: "°",
    },
    {
      label: "Straight Leg Raise",
      left: data.straight_leg_l,
      right: data.straight_leg_r,
      unit: "°",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 border-b border-default-100 pb-2 text-xs font-semibold text-default-600">
        <div>Metric</div>
        <div className="text-center">Left</div>
        <div className="text-center">Right</div>
      </div>
      {metrics.map((metric, index) => (
        <div key={index} className="grid grid-cols-3 gap-2 py-1 text-sm">
          <div>{metric.label}</div>
          <div className="text-center font-medium">
            {metric.left !== undefined && metric.left !== null
              ? `${metric.left}${metric.unit}`
              : "—"}
          </div>
          <div className="text-center font-medium">
            {metric.right !== undefined && metric.right !== null
              ? `${metric.right}${metric.unit}`
              : "—"}
          </div>
        </div>
      ))}
      {data.notes && (
        <div className="mt-3 border-t border-default-100 pt-3 text-sm text-default-600">
          <span className="font-semibold">Notes: </span>
          {data.notes}
        </div>
      )}
    </div>
  );
}

function ForcePlateDisplay({ data }: { data: Partial<ForcePlateSelect> }) {
  const metrics = [
    { label: "Countermovement Jump", value: data.cmj, unit: "in" },
    { label: "Drop Jump (RSI)", value: data.drop_jump, unit: "" },
    { label: "Pogo (RSI)", value: data.pogo, unit: "" },
    { label: "Mid-Thigh Pull", value: data.mid_thigh_pull, unit: "N" },
    { label: "MTP Time", value: data.mtp_time, unit: "s" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="text-sm">
          <div className="mb-1 text-xs text-default-600">{metric.label}</div>
          <div className="text-base font-semibold">
            {metric.value !== undefined && metric.value !== null
              ? `${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`
              : "—"}
          </div>
        </div>
      ))}
      {data.notes && (
        <div className="col-span-2 mt-2 border-t border-default-100 pt-3 text-sm text-default-600">
          <span className="font-semibold">Notes: </span>
          {data.notes}
        </div>
      )}
    </div>
  );
}

function TrueStrengthDisplay({ data }: { data: any }) {
  const sections = [
    {
      title: "Shoulder Rotation - Peak Force",
      metrics: [
        { label: "Left", value: data.shoulder_rotation_l, unit: "N" },
        { label: "Right", value: data.shoulder_rotation_r, unit: "N" },
      ],
    },
    {
      title: "Shoulder Rotation - RFD",
      metrics: [
        { label: "Left", value: data.shoulder_rotation_rfd_l, unit: "N/s" },
        { label: "Right", value: data.shoulder_rotation_rfd_r, unit: "N/s" },
      ],
    },
    {
      title: "Hip Rotation - Peak Force",
      metrics: [
        { label: "Left", value: data.hip_rotation_l, unit: "N" },
        { label: "Right", value: data.hip_rotation_r, unit: "N" },
      ],
    },
    {
      title: "Hip Rotation - RFD",
      metrics: [
        { label: "Left", value: data.hip_rotation_rfd_l, unit: "N/s" },
        { label: "Right", value: data.hip_rotation_rfd_r, unit: "N/s" },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section, index) => (
        <div key={index}>
          <div className="mb-2 text-xs font-semibold text-default-600">
            {section.title}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {section.metrics.map((metric, metricIndex) => (
              <div key={metricIndex} className="text-sm">
                <span className="text-default-600">{metric.label}: </span>
                <span className="font-semibold">
                  {metric.value !== undefined && metric.value !== null
                    ? `${typeof metric.value === "number" ? metric.value.toFixed(2) : metric.value} ${metric.unit}`
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {data.notes && (
        <div className="mt-3 border-t pt-3 text-sm text-default-600">
          <span className="font-semibold">Notes: </span>
          {data.notes}
        </div>
      )}
    </div>
  );
}

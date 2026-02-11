import Link from "next/link";

import { Card, CardBody, CardHeader } from "@heroui/react";

import { CircularScore } from "../ui/CircularScore";

interface ArmCareProfileCardProps {
  playerId: string;
  score: number;
  date: string;
}

export function ArmCareProfileCard({
  playerId,
  score,
  date,
}: ArmCareProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>Arm Care Profile</div>
      </CardHeader>
      <CardBody className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <CircularScore
          value={score}
          maxValue={100}
          title="ArmScore"
          severity={score >= 60 ? "good" : score >= 50 ? "moderate" : "severe"}
          decimals={1}
        />
        <div className="flex flex-col gap-2 text-sm text-gray-600 md:items-end">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Last Exam
          </div>
          <div className="text-lg font-bold light:text-gray-900 dark:text-gray-100">
            {date}
          </div>
          <Link
            href={`/players/${playerId}/health/armcare-summary`}
            className="text-primary hover:underline"
          >
            View Full ArmCare Summary
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

"use client";

import Link from "next/link";

import {
  Card,
  CardBody,
  Chip,
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import {
  DashboardPlayersData,
  IncompleteProfileReason,
} from "@/domain/dashboard/types";

const REASON_LABELS: Record<IncompleteProfileReason, string> = {
  missing_first_name: "Missing first name",
  missing_last_name: "Missing last name",
  missing_primary_coach: "Missing primary coach",
  invalid_throws: "Invalid throws",
  invalid_hits: "Invalid hits",
  age_under_5: "Age under 5",
};

function formatDate(date: string | null): string {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString();
}

export function DashboardPlayersTab({ data }: { data: DashboardPlayersData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Active Players</p>
            <p className="text-2xl font-semibold">{data.activePlayers}</p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Total Lessons</p>
            <p className="text-2xl font-semibold">{data.totalLessons}</p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Avg Lessons / Player</p>
            <p className="text-2xl font-semibold">{data.avgLessonsPerPlayer}</p>
          </CardBody>
        </Card>
      </div>

      <Card shadow="sm">
        <CardBody>
          <h2 className="mb-3 text-lg font-semibold">Player Activity</h2>
          <ScrollShadow className="max-h-64 rounded-md bg-transparent">
            <Table
              aria-label="Player activity"
              removeWrapper
              classNames={{ table: "bg-transparent" }}
            >
              <TableHeader>
                <TableColumn>PLAYER</TableColumn>
                <TableColumn className="text-right">LESSONS</TableColumn>
                <TableColumn className="text-right">COACHES</TableColumn>
                <TableColumn className="text-right">LATEST LESSON</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No player activity found for this range">
                {data.playerRows.map((row) => (
                  <TableRow key={row.playerId}>
                    <TableCell>
                      <Link
                        href={`/players/${row.playerId}/overview`}
                        className="hover:underline"
                      >
                        {row.firstName} {row.lastName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">{row.lessons}</TableCell>
                    <TableCell className="text-right">
                      {row.uniqueCoaches}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(row.latestLessonDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollShadow>
        </CardBody>
      </Card>

      <Card shadow="sm">
        <CardBody>
          <h2 className="mb-3 text-lg font-semibold">
            Incomplete Player Profiles
          </h2>
          <ScrollShadow className="max-h-80 rounded-md bg-transparent">
            <Table
              aria-label="Incomplete player profiles"
              removeWrapper
              classNames={{ table: "bg-transparent" }}
            >
              <TableHeader>
                <TableColumn>PLAYER</TableColumn>
                <TableColumn>REASONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No incomplete profiles found">
                {data.incompleteProfiles.map((row) => (
                  <TableRow key={row.playerId}>
                    <TableCell>
                      <Link
                        href={`/players/${row.playerId}/overview`}
                        className="hover:underline"
                      >
                        {row.firstName || "Unknown"} {row.lastName || "Player"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {row.reasons.map((reason) => (
                          <Chip
                            key={`${row.playerId}-${reason}`}
                            size="sm"
                            color="warning"
                            variant="flat"
                          >
                            {REASON_LABELS[reason]}
                          </Chip>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollShadow>
        </CardBody>
      </Card>
    </div>
  );
}

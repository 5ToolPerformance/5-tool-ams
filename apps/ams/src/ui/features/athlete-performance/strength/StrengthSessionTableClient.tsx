"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import type { StrengthSession } from "./types";

interface StrengthSessionTableClientProps {
  sessions: StrengthSession[];
}

export function StrengthSessionTableClient({
  sessions,
}: StrengthSessionTableClientProps) {
  return (
    <Table aria-label="Strength session table">
      <TableHeader>
        <TableColumn key="date">Date</TableColumn>
        <TableColumn key="test">Test Type</TableColumn>
        <TableColumn key="rating">Power Rating</TableColumn>
        <TableColumn key="metrics">Key Metrics</TableColumn>
        <TableColumn key="notes">Notes</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No sessions found.">
        {sessions.map((session) => (
          <TableRow key={`${session.date}-${session.testType}`}>
            <TableCell>{session.date}</TableCell>
            <TableCell>{session.testType}</TableCell>
            <TableCell>{session.powerRating.score}</TableCell>
            <TableCell>
              <div className="space-y-1 text-xs text-muted-foreground">
                {session.metrics.slice(0, 3).map((metric) => (
                  <div key={metric.key}>
                    {metric.label}: {metric.value} {metric.unit}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-xs text-muted-foreground">
                {session.notesRef ?? "N/A"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

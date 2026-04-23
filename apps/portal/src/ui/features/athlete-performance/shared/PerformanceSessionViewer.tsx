"use client";

import {
  Accordion,
  AccordionItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import type { PerformanceEvidenceSession } from "@ams/application/players/performance/getPlayerPerformanceData.types";

interface PerformanceSessionViewerProps {
  sessions: PerformanceEvidenceSession[];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PerformanceSessionViewer({
  sessions,
}: PerformanceSessionViewerProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-divider p-4 text-sm text-muted-foreground">
        No sessions are available yet.
      </div>
    );
  }

  return (
    <Accordion variant="splitted" selectionMode="multiple">
      {sessions.map((session) => (
        <AccordionItem
          key={session.id}
          aria-label={`${session.sourceLabel} session ${formatDate(
            session.recordedAt
          )}`}
          title={
            <div className="flex flex-wrap items-center gap-3">
              <span>{formatDate(session.recordedAt)}</span>
              <Chip size="sm" variant="flat">
                {session.sourceLabel}
              </Chip>
              <Chip size="sm" variant="bordered">
                {session.status}
              </Chip>
            </div>
          }
          subtitle={session.notes ?? "Open to view the full session table."}
        >
          <div className="space-y-4">
            <Table aria-label={`${session.sourceLabel} session table`}>
              <TableHeader>
                {session.tableColumns.map((column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                ))}
              </TableHeader>
              <TableBody emptyContent="No rows available for this session.">
                {session.tableRows.map((row) => (
                  <TableRow key={row.id}>
                    {session.tableColumns.map((column) => (
                      <TableCell key={column.key}>
                        {row.cells[column.key] ?? "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
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

import { DashboardReportsData } from "@/domain/dashboard/types";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
}

function getStatusColor(status: "pending" | "complete" | "failed") {
  switch (status) {
    case "complete":
      return "success";
    case "failed":
      return "danger";
    default:
      return "warning";
  }
}

export function DashboardReportsTab({ data }: { data: DashboardReportsData }) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [requestState, setRequestState] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleGeneratePreviousWeekReport() {
    setIsGenerating(true);
    setRequestState(null);

    try {
      const response = await fetch("/api/admin/weekly-usage-reports", {
        method: "POST",
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        setRequestState({
          type: "error",
          message: payload?.error ?? "Failed to generate weekly report.",
        });
        return;
      }

      setRequestState({
        type: "success",
        message: `Generated report for ${payload.result.label}.`,
      });
      router.refresh();
    } catch (error) {
      setRequestState({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to generate weekly report.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Reports</p>
            <p className="text-2xl font-semibold">{data.reportRows.length}</p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Completed</p>
            <p className="text-2xl font-semibold">
              {data.reportRows.filter((row) => row.status === "complete").length}
            </p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Failed</p>
            <p className="text-2xl font-semibold">
              {data.reportRows.filter((row) => row.status === "failed").length}
            </p>
          </CardBody>
        </Card>
      </div>

      <Card shadow="sm">
        <CardBody>
          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Weekly Reports</h2>
              <p className="text-sm text-default-500">
                Use the fallback action to generate the previous week if cron misses a run.
              </p>
            </div>
            <Button
              color="primary"
              variant="flat"
              onPress={handleGeneratePreviousWeekReport}
              isLoading={isGenerating}
            >
              Generate Previous Week
            </Button>
          </div>
          {requestState ? (
            <p
              className={`mb-3 text-sm ${
                requestState.type === "error" ? "text-danger" : "text-success"
              }`}
            >
              {requestState.message}
            </p>
          ) : null}
          <ScrollShadow className="max-h-[36rem] rounded-md bg-transparent">
            <Table
              aria-label="Weekly usage reports"
              removeWrapper
              classNames={{ table: "bg-transparent" }}
            >
              <TableHeader>
                <TableColumn>WEEK</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn className="text-right">LESSONS</TableColumn>
                <TableColumn className="text-right">PLAYERS</TableColumn>
                <TableColumn className="text-right">COACHES</TableColumn>
                <TableColumn className="text-right">NEW PLAYERS</TableColumn>
                <TableColumn className="text-right">INJURIES</TableColumn>
                <TableColumn>GENERATED</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No weekly reports found">
                {data.reportRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{row.label}</p>
                        <p className="text-xs text-default-500">
                          {formatDate(row.weekStart)} - {formatDate(row.weekEnd)}
                        </p>
                        {row.errorMessage ? (
                          <p className="text-xs text-danger">{row.errorMessage}</p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color={getStatusColor(row.status)} variant="flat">
                        {row.status}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-right">{row.summary.lessonsCreated}</TableCell>
                    <TableCell className="text-right">{row.summary.activePlayers}</TableCell>
                    <TableCell className="text-right">{row.summary.activeCoaches}</TableCell>
                    <TableCell className="text-right">{row.summary.newPlayersAdded}</TableCell>
                    <TableCell className="text-right">{row.summary.injuriesLogged}</TableCell>
                    <TableCell>{formatDate(row.generatedAt ?? row.failedAt)}</TableCell>
                    <TableCell>
                      {row.viewHref && row.downloadHref ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            as={Link}
                            href={row.viewHref}
                            target="_blank"
                            rel="noreferrer"
                            size="sm"
                            variant="flat"
                            color="primary"
                          >
                            View PDF
                          </Button>
                          <Button
                            as={Link}
                            href={row.downloadHref}
                            size="sm"
                            variant="light"
                            color="primary"
                          >
                            Download
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-default-500">Unavailable</span>
                      )}
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

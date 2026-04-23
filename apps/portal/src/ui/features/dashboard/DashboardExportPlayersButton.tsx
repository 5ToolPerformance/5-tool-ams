"use client";

import { useMemo, useState } from "react";

import { Button } from "@heroui/react";

type PlayerRecord = {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  date_of_birth?: string | null;
  position?: string | null;
  throws?: string | null;
  hits?: string | null;
  height?: number | string | null;
  weight?: number | string | null;
  sport?: string | null;
  prospect?: boolean | null;
  primaryCoachId?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const CSV_HEADERS = [
  "id",
  "firstName",
  "lastName",
  "date_of_birth",
  "position",
  "throws",
  "hits",
  "height",
  "weight",
  "sport",
  "prospect",
  "primaryCoachId",
  "created_at",
  "updated_at",
] as const;

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes("\"") ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }
  return stringValue;
}

function toCsv(players: PlayerRecord[]): string {
  const headerRow = CSV_HEADERS.join(",");
  const rows = players.map((player) =>
    CSV_HEADERS.map((key) => escapeCsvValue(player[key])).join(",")
  );
  return [headerRow, ...rows].join("\n");
}

function getExportFileName(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `players-export-${yyyy}-${mm}-${dd}.csv`;
}

export function DashboardExportPlayersButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const helperText = useMemo(() => {
    if (error) return error;
    return null;
  }, [error]);

  async function onExport() {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch("/api/players");
      if (!response.ok) {
        throw new Error("Failed to fetch players.");
      }

      const payload = await response.json();
      const players = Array.isArray(payload?.data) ? payload.data : [];
      const csv = toCsv(players as PlayerRecord[]);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = getExportFileName();
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to export players.";
      setError(message);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        color="primary"
        variant="flat"
        isLoading={isExporting}
        onPress={onExport}
      >
        Export Players
      </Button>
      {helperText ? <p className="text-xs text-danger">{helperText}</p> : null}
    </div>
  );
}

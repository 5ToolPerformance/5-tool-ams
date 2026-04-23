"use client";

import { useEffect, useMemo, useState } from "react";

import Papa from "papaparse";

type CSVViewerProps = {
  attachmentId: string;
  maxRows?: number;
};

type ParsedRow = Record<string, string | number | null>;

export function CSVViewer({
  attachmentId,
  maxRows = 200,
}: CSVViewerProps) {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCsv() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/attachments/${attachmentId}/content`
        );
        if (!res.ok) {
          throw new Error("Failed to load CSV");
        }
        const text = await res.text();
        const parsed = Papa.parse<ParsedRow>(text, {
          header: true,
          skipEmptyLines: true,
          preview: maxRows,
        });

        if (parsed.errors.length > 0) {
          throw new Error("CSV parsing failed");
        }

        if (!cancelled) {
          setRows(parsed.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Unable to render CSV preview");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCsv();

    return () => {
      cancelled = true;
    };
  }, [attachmentId, maxRows]);

  const columns = useMemo(() => {
    const firstRow = rows[0];
    return firstRow ? Object.keys(firstRow) : [];
  }, [rows]);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading CSV preview…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No rows to display.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">
        Showing first {Math.min(rows.length, maxRows)} rows
      </div>
      <div className="max-h-[60vh] overflow-auto rounded-lg border">
        <table className="min-w-full text-left text-xs">
          <thead className="sticky top-0 bg-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="border-b px-3 py-2 font-semibold"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${index}`}>
                {columns.map((column) => (
                  <td key={column} className="border-b px-3 py-2">
                    {row[column] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import type { PerformanceDocumentsAttachment } from "@/application/players/performance-documents/getPerformanceDocumentsData";
import { useAttachmentViewer } from "@/ui/features/attachments/AttachmentViewerProvider";

type PerformanceDocumentsPanelProps = {
  title: string;
  attachments: PerformanceDocumentsAttachment[];
  allowedSources: string[];
};

function shouldIncludeAttachment(
  attachment: PerformanceDocumentsAttachment,
  allowedSources: string[]
) {
  const source = attachment.source?.toLowerCase() ?? "";
  return allowedSources.some(
    (allowed) => allowed.toLowerCase() === source
  );
}

export function PerformanceDocumentsPanel({
  title,
  attachments,
  allowedSources,
}: PerformanceDocumentsPanelProps) {
  const { openAttachment } = useAttachmentViewer();
  const filtered = attachments.filter((attachment) =>
    shouldIncludeAttachment(attachment, allowedSources)
  );

  if (filtered.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        No performance documents available.
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">
            Documents filtered by performance source.
          </p>
        </div>
        <Chip size="sm" variant="flat">
          {filtered.length} file{filtered.length === 1 ? "" : "s"}
        </Chip>
      </div>

      <Table aria-label="Performance documents">
        <TableHeader>
          <TableColumn>FILE</TableColumn>
          <TableColumn>SOURCE</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>UPLOADED</TableColumn>
          <TableColumn align="end">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No documents match this filter.">
          {filtered.map((row) => {
            const hasFile = Boolean(row.file?.storageKey);
            return (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {row.file?.originalFileName ?? "Missing file"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {row.notes ?? ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{row.source}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {row.type}
                  </Chip>
                </TableCell>
                <TableCell>
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => openAttachment(row)}
                    isDisabled={!hasFile}
                  >
                    {hasFile ? "View" : "Missing file"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

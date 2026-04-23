"use client";

import {
  Button,
  Chip,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { parseDate } from "@internationalized/date";
import { toast } from "sonner";

import type {
  ContextDocumentsAttachment,
} from "@/application/players/context-documents/getContextDocumentsData";
import { useAttachmentViewer } from "@/ui/features/attachments/AttachmentViewerProvider";

type ContextDocumentsTabProps = {
  attachments: ContextDocumentsAttachment[];
};

export function ContextDocumentsTab({
  attachments,
}: ContextDocumentsTabProps) {
  const { openAttachment } = useAttachmentViewer();
  const [rows, setRows] = useState(attachments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [isUpdatingEffectiveDate, setIsUpdatingEffectiveDate] =
    useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (typeFilter !== "all" && row.type !== typeFilter) return false;
      if (
        visibilityFilter !== "all" &&
        (row.visibility ?? "internal") !== visibilityFilter
      ) {
        return false;
      }

      if (!searchLower) return true;
      const haystack = [
        row.file?.originalFileName,
        row.source,
        row.notes,
        row.documentType,
        row.evidenceCategory,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchLower);
    });
  }, [rows, search, typeFilter, visibilityFilter]);

  async function handleEffectiveDateChange(
    attachmentId: string,
    nextValue: string
  ) {
    const previous =
      rows.find((row) => row.id === attachmentId)?.effectiveDate ?? "";

    setRows((current) =>
      current.map((row) =>
        row.id === attachmentId ? { ...row, effectiveDate: nextValue } : row
      )
    );
    setIsUpdatingEffectiveDate(attachmentId);

    try {
      const res = await fetch(
        `/api/attachments/${attachmentId}/effective-date`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ effectiveDate: nextValue }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to update effective date");
      }
      toast.success("Effective date updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update effective date");
      setRows((current) =>
        current.map((row) =>
          row.id === attachmentId ? { ...row, effectiveDate: previous } : row
        )
      );
    } finally {
      setIsUpdatingEffectiveDate(null);
    }
  }

  const typeOptions = useMemo(() => {
    const set = new Set(rows.map((row) => row.type));
    const options = Array.from(set).map((type) => ({
      key: type,
      label: type,
    }));
    return [{ key: "all", label: "All types" }, ...options];
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Context & Documents</h2>
          <p className="text-sm text-muted-foreground">
            Manage files uploaded for this player and link them to lessons.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <Input
            label="Search"
            placeholder="Search files, notes, source..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="md:w-64"
          />

          <Select
            label="Type"
            selectedKeys={[typeFilter]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              setTypeFilter(selected ? String(selected) : "all");
            }}
            className="md:w-44"
            items={typeOptions}
          >
            {(item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>

          <Select
            label="Visibility"
            selectedKeys={[visibilityFilter]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              setVisibilityFilter(selected ? String(selected) : "all");
            }}
            className="md:w-44"
          >
            <SelectItem key="all">All visibilities</SelectItem>
            <SelectItem key="internal">Internal</SelectItem>
            <SelectItem key="private">Private</SelectItem>
            <SelectItem key="public">Public</SelectItem>
          </Select>
        </div>
      </div>

      <Table aria-label="Context documents table">
        <TableHeader>
          <TableColumn>FILE</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>VISIBILITY</TableColumn>
          <TableColumn>EFFECTIVE DATE</TableColumn>
          <TableColumn>UPLOADED</TableColumn>
          <TableColumn align="end">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No attachments found.">
          {filteredRows.map((row) => {
            const hasFile = Boolean(row.file?.storageKey);
            return (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {row.file?.originalFileName ?? "Missing file"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {row.source}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {row.type}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm capitalize">
                      {row.evidenceCategory ?? "—"}
                    </span>
                    {row.documentType && (
                      <span className="text-xs text-muted-foreground">
                        {row.documentType.replace("_", " ")}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {row.visibility ?? "internal"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <DatePicker
                    aria-label="Effective date"
                    value={
                      row.effectiveDate ? parseDate(row.effectiveDate) : null
                    }
                    onChange={(value) => {
                      if (!value) return;
                      const nextValue = value.toString();
                      if (nextValue === row.effectiveDate) return;
                      handleEffectiveDateChange(row.id, nextValue);
                    }}
                    isDisabled={isUpdatingEffectiveDate === row.id}
                  />
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

"use client";

import {
  Button,
  Chip,
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
import { toast } from "sonner";

import type {
  ContextDocumentsAttachment,
  ContextDocumentsLessonOption,
} from "@/application/players/context-documents/getContextDocumentsData";

type ContextDocumentsTabProps = {
  attachments: ContextDocumentsAttachment[];
  lessonOptions: ContextDocumentsLessonOption[];
};

type LinkedFilter = "all" | "linked" | "unlinked";

function formatLessonLabel(option: ContextDocumentsLessonOption) {
  const dateLabel = option.lessonDate
    ? new Date(option.lessonDate).toLocaleDateString()
    : "Unknown date";
  const typeLabel = option.lessonType ?? "Lesson";
  const coachLabel = option.coachName ? ` · ${option.coachName}` : "";
  return `${dateLabel} · ${typeLabel}${coachLabel}`;
}

export function ContextDocumentsTab({
  attachments,
  lessonOptions,
}: ContextDocumentsTabProps) {
  const [rows, setRows] = useState(attachments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [linkedFilter, setLinkedFilter] = useState<LinkedFilter>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const lessonLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const option of lessonOptions) {
      map.set(option.lessonPlayerId, formatLessonLabel(option));
    }
    return map;
  }, [lessonOptions]);

  const lessonSelectOptions = useMemo(() => {
    return [
      { key: "unlinked", label: "Unlinked" },
      ...lessonOptions.map((option) => ({
        key: option.lessonPlayerId,
        label: formatLessonLabel(option),
      })),
    ];
  }, [lessonOptions]);

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
      if (linkedFilter === "linked" && !row.lessonPlayerId) return false;
      if (linkedFilter === "unlinked" && row.lessonPlayerId) return false;

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
  }, [rows, search, typeFilter, visibilityFilter, linkedFilter]);

  async function handleView(attachmentId: string) {
    try {
      const res = await fetch(`/api/attachments/${attachmentId}/view`);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to open attachment");
      }
      const data = (await res.json()) as { url: string };
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
      toast.error("Unable to open attachment");
    }
  }

  async function handleLinkChange(attachmentId: string, nextValue: string) {
    const lessonPlayerId = nextValue === "unlinked" ? null : nextValue;
    const previous = rows.find((row) => row.id === attachmentId)?.lessonPlayerId;

    setRows((current) =>
      current.map((row) =>
        row.id === attachmentId ? { ...row, lessonPlayerId } : row
      )
    );
    setIsUpdating(attachmentId);

    try {
      const res = await fetch(`/api/attachments/${attachmentId}/link`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonPlayerId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to update link");
      }
      toast.success("Attachment link updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update attachment link");
      setRows((current) =>
        current.map((row) =>
          row.id === attachmentId ? { ...row, lessonPlayerId: previous ?? null } : row
        )
      );
    } finally {
      setIsUpdating(null);
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

          <Select
            label="Linked"
            selectedKeys={[linkedFilter]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              setLinkedFilter((selected ? String(selected) : "all") as LinkedFilter);
            }}
            className="md:w-40"
          >
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="linked">Linked</SelectItem>
            <SelectItem key="unlinked">Unlinked</SelectItem>
          </Select>
        </div>
      </div>

      <Table aria-label="Context documents table">
        <TableHeader>
          <TableColumn>FILE</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>VISIBILITY</TableColumn>
          <TableColumn>LINKED LESSON</TableColumn>
          <TableColumn>UPLOADED</TableColumn>
          <TableColumn align="end">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No attachments found.">
          {filteredRows.map((row) => {
            const lessonLabel = row.lessonPlayerId
              ? lessonLabelById.get(row.lessonPlayerId) ?? "Linked lesson"
              : "Unlinked";
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
                  <Select
                    aria-label="Linked lesson"
                    selectedKeys={[
                      row.lessonPlayerId ?? "unlinked",
                    ]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      handleLinkChange(
                        row.id,
                        selected ? String(selected) : "unlinked"
                      );
                    }}
                    isDisabled={isUpdating === row.id}
                    className="min-w-[220px]"
                    items={lessonSelectOptions}
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {lessonLabel}
                  </div>
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
                    onPress={() => handleView(row.id)}
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

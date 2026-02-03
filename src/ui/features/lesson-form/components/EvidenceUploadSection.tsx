"use client";

import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";

export type EvidenceUploadSource = "hitrax" | "blast_motion" | "video";

export type EvidenceUploadItem = {
  id: string;
  source: EvidenceUploadSource;
  notes: string;
  file: File | null;
};

export type EvidenceUploadDraft = {
  items: EvidenceUploadItem[];
};

type EvidenceUploadSectionProps = {
  playerName: string;
  draft?: EvidenceUploadDraft;
  onDraftChange?: (draft: EvidenceUploadDraft) => void;
};

const DEFAULT_ITEM: EvidenceUploadItem = {
  id: "default",
  source: "hitrax",
  notes: "",
  file: null,
};

const DEFAULT_DRAFT: EvidenceUploadDraft = {
  items: [DEFAULT_ITEM],
};

export function EvidenceUploadSection({
  playerName,
  draft,
  onDraftChange,
}: EvidenceUploadSectionProps) {
  const resolvedDraft = draft ?? DEFAULT_DRAFT;

  function updateDraft(next: EvidenceUploadDraft) {
    if (!onDraftChange) return;
    onDraftChange(next);
  }

  function updateItem(id: string, next: Partial<EvidenceUploadItem>) {
    const items = resolvedDraft.items.map((item) =>
      item.id === id ? { ...item, ...next } : item
    );
    updateDraft({ items });
  }

  function addItem() {
    const newItem: EvidenceUploadItem = {
      ...DEFAULT_ITEM,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    updateDraft({ items: [...resolvedDraft.items, newItem] });
  }

  function removeItem(id: string) {
    const items = resolvedDraft.items.filter((item) => item.id !== id);
    updateDraft({ items: items.length > 0 ? items : [DEFAULT_ITEM] });
  }

  return (
    <Accordion
      variant="splitted"
      selectionMode="multiple"
      className="mt-2"
    >
      <AccordionItem
        key="upload"
        aria-label={`Upload evidence for ${playerName}`}
        title="Upload Evidence"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-500">
            Attach CSV or video evidence for {playerName}.
          </p>

          <div className="space-y-4">
            {resolvedDraft.items.map((item, index) => {
              const accept =
                item.source === "video" ? "video/*" : ".csv";

              return (
                <div
                  key={item.id}
                  className="rounded-md border border-default-200 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      Upload {index + 1}
                    </p>
                    <Button
                      size="sm"
                      variant="flat"
                      isDisabled={resolvedDraft.items.length === 1}
                      onPress={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Select
                      label="Source"
                      selectedKeys={[item.source]}
                      onSelectionChange={(keys) =>
                        updateItem(item.id, {
                          source: Array.from(keys)[0] as EvidenceUploadSource,
                          file: null,
                        })
                      }
                    >
                      <SelectItem key="hitrax">HitTrax</SelectItem>
                      <SelectItem key="blast_motion">Blast Motion</SelectItem>
                      <SelectItem key="video">Video</SelectItem>
                    </Select>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <Input
                      type="file"
                      label="File"
                      accept={accept}
                      onChange={(e) =>
                        updateItem(item.id, {
                          file: e.target.files?.[0] ?? null,
                        })
                      }
                    />

                    <Button
                      size="sm"
                      variant="flat"
                      isDisabled={!item.file}
                      onPress={() => updateItem(item.id, { file: null })}
                    >
                      Clear
                    </Button>
                  </div>

                  {item.file && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <Chip size="sm" variant="flat">
                        {item.file.name}
                      </Chip>
                      <span className="text-foreground-500">
                        {item.source === "video"
                          ? "Video selected"
                          : "CSV selected"}
                      </span>
                    </div>
                  )}

                  <Textarea
                    className="mt-3"
                    label="Notes"
                    placeholder="Optional notes about this upload"
                    minRows={2}
                    value={item.notes}
                    onChange={(e) =>
                      updateItem(item.id, { notes: e.target.value })
                    }
                  />
                </div>
              );
            })}
          </div>

          <Button size="sm" variant="flat" onPress={addItem}>
            Add Another File
          </Button>
        </div>
      </AccordionItem>
    </Accordion>
  );
}

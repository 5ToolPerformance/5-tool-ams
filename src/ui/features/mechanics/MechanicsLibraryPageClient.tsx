"use client";

import { useMemo, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { Search } from "lucide-react";
import useSWR from "swr";

import { MechanicForm } from "./MechanicForm";
import { MechanicsImportModal } from "./MechanicsImportModal";
import { MechanicListItem, MechanicType } from "./types";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load mechanics");
  }

  return (await response.json()) as MechanicListItem[];
};

const TYPE_ORDER: Record<MechanicType, number> = {
  hitting: 0,
  pitching: 1,
  strength: 2,
  fielding: 3,
  catching: 4,
};

const TYPE_LABELS: Record<MechanicType, string> = {
  hitting: "Hitting",
  pitching: "Pitching",
  strength: "Strength",
  fielding: "Fielding",
  catching: "Catching",
};

type FilterKey = "all" | MechanicType;

export function MechanicsLibraryPageClient() {
  const { data, error, isLoading, mutate } = useSWR("/api/mechanics", fetcher);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<FilterKey>("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editing, setEditing] = useState<MechanicListItem | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];

    const normalized = query.trim().toLowerCase();

    return data
      .filter((mechanic) => {
        const matchesType = activeType === "all" || mechanic.type === activeType;
        const tags = mechanic.tags ?? [];
        const matchesSearch =
          normalized.length === 0 ||
          mechanic.name.toLowerCase().includes(normalized) ||
          tags.some((tag) => tag.toLowerCase().includes(normalized));

        return matchesType && matchesSearch;
      })
      .sort((a, b) => {
        const orderDiff = TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
        if (orderDiff !== 0) return orderDiff;
        return a.name.localeCompare(b.name);
      });
  }, [activeType, data, query]);

  function openCreate() {
    setEditing(null);
    setIsEditorOpen(true);
  }

  function openEdit(mechanic: MechanicListItem) {
    setEditing(mechanic);
    setIsEditorOpen(true);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this mechanic?");
    if (!confirmed) return;

    setIsDeletingId(id);
    try {
      await fetch(`/api/mechanics/${id}`, { method: "DELETE" });
      await mutate();
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Mechanics</h2>
            <p className="text-sm text-foreground-500">
              Create and organize teaching points coaches can reuse across the facility.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="flat" onPress={() => setImportOpen(true)}>
              Import CSV
            </Button>
            <Button color="primary" onPress={openCreate}>
              New Mechanic
            </Button>
          </div>
        </div>

        <Tabs
          selectedKey={activeType}
          onSelectionChange={(key) => setActiveType(String(key) as FilterKey)}
          variant="underlined"
          className="border-b border-divider"
        >
          <Tab key="all" title="All" />
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <Tab key={key} title={label} />
          ))}
        </Tabs>

        <Input
          placeholder="Search mechanics by name or tag"
          startContent={<Search className="h-4 w-4 text-foreground-500" />}
          value={query}
          onValueChange={setQuery}
        />

        {isLoading && (
          <p className="rounded-md border border-dashed border-default-300 p-6 text-center text-sm text-foreground-500">
            Loading mechanics...
          </p>
        )}

        {error && !isLoading && (
          <p className="rounded-md border border-danger-200 bg-danger-50 p-6 text-center text-sm text-danger-700">
            Failed to load mechanics.
          </p>
        )}

        {!isLoading && !error && (
          <div className="max-h-[65vh] overflow-y-scroll rounded-lg border border-default-200 bg-content1 p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((mechanic) => (
                <Card key={mechanic.id} className="h-full">
                  <CardBody className="flex h-full flex-col gap-3">
                    <div className="space-y-1">
                      <h3 className="line-clamp-2 text-lg font-semibold">{mechanic.name}</h3>
                      <p className="line-clamp-3 min-h-[3.75rem] text-sm text-foreground-500">
                        {mechanic.description?.trim() || "No description provided."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Chip size="sm" color="secondary" variant="flat">
                        {TYPE_LABELS[mechanic.type]}
                      </Chip>
                      {(mechanic.tags ?? []).map((tag) => (
                        <Chip key={`${mechanic.id}-${tag}`} size="sm" variant="flat">
                          {tag}
                        </Chip>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center gap-2">
                      <Button size="sm" variant="bordered" onPress={() => openEdit(mechanic)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        isLoading={isDeletingId === mechanic.id}
                        onPress={() => handleDelete(mechanic.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="rounded-md border border-dashed border-default-300 p-6 text-center text-sm text-foreground-500">
                No mechanics found.
              </p>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{editing ? "Edit Mechanic" : "Create Mechanic"}</ModalHeader>
              <ModalBody>
                <MechanicForm
                  initialValues={editing ?? undefined}
                  onSuccess={() => {
                    void mutate();
                    onClose();
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <MechanicsImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={() => void mutate()}
      />
    </>
  );
}

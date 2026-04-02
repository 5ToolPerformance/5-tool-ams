"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { IconNotebook, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import {
  createJournalEntryAction,
  deleteJournalEntryAction,
  getJournalEntryReadAction,
  updateJournalEntryAction,
} from "@/app/actions/journal";
import type {
  CreateHittingJournalEntryInput,
  CreateJournalEntryInput,
  CreateThrowingJournalEntryInput,
  JournalEntryDetail,
  JournalEntryEditPayload,
  JournalEntryListItem,
  JournalFeedFilter,
} from "@/domain/journal/types";

import {
  HittingJournalForm,
  ThrowingJournalForm,
  createEmptyAtBat,
  createEmptyThrowingSegment,
} from "./JournalEntryForms";

type DrawerMode = "create" | "edit";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function createThrowingEntry(playerId: string): CreateThrowingJournalEntryInput {
  return {
    playerId,
    entryType: "throwing",
    entryDate: todayIso(),
    contextType: "practice",
    title: null,
    summaryNote: null,
    overallFeel: null,
    confidenceScore: null,
    sessionNote: null,
    workloadSegments: [createEmptyThrowingSegment()],
    armCheckin: null,
  };
}

function createHittingEntry(playerId: string): CreateHittingJournalEntryInput {
  return {
    playerId,
    entryType: "hitting",
    entryDate: todayIso(),
    contextType: "game",
    title: null,
    summaryNote: null,
    opponent: null,
    teamName: null,
    location: null,
    overallFeel: null,
    confidenceScore: null,
    hittingSummaryNote: null,
    atBats: [createEmptyAtBat(1)],
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function chipColor(tone?: "default" | "primary" | "success" | "warning") {
  switch (tone) {
    case "primary":
      return "primary";
    case "success":
      return "success";
    case "warning":
      return "warning";
    default:
      return "default";
  }
}

function toEditPayload(detail: JournalEntryDetail): JournalEntryEditPayload {
  if (detail.entryType === "throwing") {
    return {
      id: detail.id,
      playerId: detail.playerId,
      entryType: "throwing",
      entryDate: detail.entryDate,
      contextType: detail.contextType,
      title: detail.title,
      summaryNote: detail.summaryNote,
      overallFeel: detail.overallFeel,
      confidenceScore: detail.confidenceScore,
      sessionNote: detail.sessionNote,
      workloadSegments: detail.workloadSegments.map(({ id: _id, ...segment }) => segment),
      armCheckin: detail.armCheckin,
    };
  }

  return {
    id: detail.id,
    playerId: detail.playerId,
    entryType: "hitting",
    entryDate: detail.entryDate,
    contextType: detail.contextType,
    title: detail.title,
    summaryNote: detail.summaryNote,
    opponent: detail.opponent,
    teamName: detail.teamName,
    location: detail.location,
    overallFeel: detail.overallFeel,
    confidenceScore: detail.confidenceScore,
    hittingSummaryNote: detail.hittingSummaryNote,
    atBats: detail.atBats.map(({ id: _id, ...atBat }) => atBat),
  };
}

export function JournalPageClient({
  playerId,
  playerName,
  entries,
  selectedFilter,
  canLogActivity,
}: {
  playerId: string;
  playerName: string;
  entries: JournalEntryListItem[];
  selectedFilter: JournalFeedFilter;
  canLogActivity: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailsById, setDetailsById] = useState<Record<string, JournalEntryDetail>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [draft, setDraft] = useState<CreateJournalEntryInput | JournalEntryEditPayload>(
    createThrowingEntry(playerId)
  );
  const [deleteTarget, setDeleteTarget] = useState<JournalEntryListItem | null>(null);

  const feedEntries = useMemo(() => entries, [entries]);

  function updateFilter(nextFilter: JournalFeedFilter) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("playerId", playerId);
    if (nextFilter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", nextFilter);
    }
    router.push(`/portal/journal?${params.toString()}`);
  }

  function openCreate(entryType: "throwing" | "hitting") {
    setDrawerMode("create");
    setDraft(entryType === "throwing" ? createThrowingEntry(playerId) : createHittingEntry(playerId));
    setDrawerOpen(true);
  }

  function cacheDetail(detail: JournalEntryDetail) {
    setDetailsById((current) => ({ ...current, [detail.id]: detail }));
  }

  function loadDetail(entryId: string, callback?: (detail: JournalEntryDetail) => void) {
    startTransition(async () => {
      if (detailsById[entryId]) {
        setExpandedId((current) => (current === entryId ? null : entryId));
        callback?.(detailsById[entryId]);
        return;
      }

      const result = await getJournalEntryReadAction(entryId);
      if (!result.success || !result.data) {
        toast.error(result.success ? "Unable to load journal entry" : result.error);
        return;
      }

      cacheDetail(result.data);
      setExpandedId((current) => (current === entryId ? null : entryId));
      callback?.(result.data);
    });
  }

  function openEdit(entryId: string) {
    const detail = detailsById[entryId];
    if (detail) {
      setDrawerMode("edit");
      setDraft(toEditPayload(detail));
      setDrawerOpen(true);
      return;
    }

    loadDetail(entryId, (loaded) => {
      setDrawerMode("edit");
      setDraft(toEditPayload(loaded));
      setDrawerOpen(true);
    });
  }

  async function submitDraft() {
    const result =
      drawerMode === "edit" && "id" in draft
        ? await updateJournalEntryAction(draft)
        : await createJournalEntryAction(draft as CreateJournalEntryInput);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(drawerMode === "edit" ? "Journal entry updated" : "Journal entry saved");
    setDrawerOpen(false);
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    const result = await deleteJournalEntryAction(deleteTarget.id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Journal entry deleted");
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Card className="border border-white/50 bg-white/85 shadow-sm dark:border-white/10 dark:bg-default-100/70">
        <CardBody className="space-y-4 p-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-default-500">
              Player journal
            </p>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{playerName}</h1>
                <p className="mt-1 text-sm text-default-500">
                  Log throwing sessions and game reflections without turning this into homework.
                </p>
              </div>
              <Button
                color="primary"
                startContent={<IconPlus size={16} />}
                onPress={() => openCreate("throwing")}
                isDisabled={!canLogActivity}
              >
                Log entry
              </Button>
            </div>
          </div>

          <Tabs
            selectedKey={selectedFilter}
            onSelectionChange={(key) => updateFilter(String(key) as JournalFeedFilter)}
            color="primary"
            variant="solid"
            radius="full"
            classNames={{
              tabList: "w-full overflow-x-auto rounded-full bg-default-100/80 p-1 dark:bg-white/10",
              cursor: "rounded-full",
              tab: "px-4",
            }}
          >
            <Tab key="all" title="All" />
            <Tab key="throwing" title="Throwing" />
            <Tab key="hitting" title="Hitting" />
          </Tabs>

          {!canLogActivity ? (
            <p className="text-xs text-warning-600 dark:text-warning-400">
              This account can view journal activity but cannot create or edit entries.
            </p>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="flat" onPress={() => openCreate("throwing")}>
                Throwing
              </Button>
              <Button size="sm" variant="flat" onPress={() => openCreate("hitting")}>
                Hitting
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {feedEntries.length === 0 ? (
        <Card className="border border-dashed border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5">
          <CardBody className="items-center space-y-3 p-8 text-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <IconNotebook size={22} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">No journal entries yet</h2>
              <p className="text-sm text-default-500">
                Start with a quick throwing log or a simple hitting reflection after a game.
              </p>
            </div>
            <Button color="primary" onPress={() => openCreate("throwing")} isDisabled={!canLogActivity}>
              Create first entry
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {feedEntries.map((entry) => {
            const detail = detailsById[entry.id];
            const isExpanded = expandedId === entry.id;

            return (
              <Card
                key={entry.id}
                className="border border-white/50 bg-white/85 shadow-sm dark:border-white/10 dark:bg-default-100/70"
              >
                <CardHeader className="flex flex-col items-start gap-3 p-4">
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={entry.entryType === "throwing" ? "warning" : "success"}
                        >
                          {entry.entryType}
                        </Chip>
                        {entry.contextType ? (
                          <Chip size="sm" variant="bordered">
                            {entry.contextType}
                          </Chip>
                        ) : null}
                      </div>
                      <h2 className="text-base font-semibold">
                        {entry.title ??
                          (entry.entryType === "throwing" ? "Throwing session" : "Hitting reflection")}
                      </h2>
                      <p className="text-xs uppercase tracking-wide text-default-400">
                        {formatDate(entry.entryDate)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        aria-label="Edit entry"
                        onPress={() => openEdit(entry.id)}
                        isDisabled={!canLogActivity}
                      >
                        <IconPencil size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="Delete entry"
                        onPress={() => setDeleteTarget(entry)}
                        isDisabled={!canLogActivity}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </div>
                  </div>
                  {entry.summary ? (
                    <p className="text-sm text-default-600 dark:text-default-300">{entry.summary}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {entry.highlights.map((highlight) => (
                      <Chip
                        key={`${entry.id}-${highlight.label}`}
                        size="sm"
                        variant="flat"
                        color={chipColor(highlight.tone)}
                      >
                        {highlight.label}
                      </Chip>
                    ))}
                  </div>
                </CardHeader>
                <CardBody className="gap-3 p-4 pt-0">
                  <Button
                    variant="light"
                    className="justify-start px-0 text-sm font-medium"
                    onPress={() => loadDetail(entry.id)}
                    isLoading={isPending && expandedId === entry.id}
                  >
                    {isExpanded ? "Hide details" : "View details"}
                  </Button>
                  {isExpanded && detail ? (
                    <>
                      <Divider />
                      {detail.entryType === "throwing" ? (
                        <div className="space-y-3 text-sm">
                          <p className="text-default-600 dark:text-default-300">
                            {detail.sessionNote || detail.summaryNote || "No session note added."}
                          </p>
                          {detail.workloadSegments.map((segment) => (
                            <div key={segment.id} className="rounded-2xl bg-default-100/80 p-3 dark:bg-white/5">
                              <p className="font-medium">
                                {segment.throwType.replaceAll("_", " ")} • {segment.throwCount} throws
                              </p>
                              <p className="text-default-500">
                                {segment.pitchCount ? `${segment.pitchCount} pitches` : "No pitch count"}
                                {segment.intentLevel ? ` • ${segment.intentLevel} intent` : ""}
                                {segment.velocityMax ? ` • top ${segment.velocityMax}` : ""}
                              </p>
                              {segment.notes ? <p className="mt-2 text-default-500">{segment.notes}</p> : null}
                            </div>
                          ))}
                          {detail.armCheckin ? (
                            <div className="rounded-2xl bg-default-100/80 p-3 dark:bg-white/5">
                              <p className="font-medium">Arm check-in</p>
                              <p className="text-default-500">
                                Soreness {detail.armCheckin.armSoreness ?? "-"} / Fatigue{" "}
                                {detail.armCheckin.armFatigue ?? "-"}
                              </p>
                              {detail.armCheckin.statusNote ? (
                                <p className="mt-2 text-default-500">{detail.armCheckin.statusNote}</p>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="space-y-3 text-sm">
                          <p className="text-default-600 dark:text-default-300">
                            {detail.hittingSummaryNote || detail.summaryNote || "No reflection added."}
                          </p>
                          {detail.atBats.map((atBat) => (
                            <div key={atBat.id} className="rounded-2xl bg-default-100/80 p-3 dark:bg-white/5">
                              <p className="font-medium">
                                At-bat {atBat.atBatNumber} • {atBat.outcome.replaceAll("_", " ")}
                              </p>
                              {(atBat.pitchTypeSeen || atBat.countAtResult || atBat.rbi !== null) ? (
                                <p className="text-default-500">
                                  {atBat.pitchTypeSeen ? atBat.pitchTypeSeen : "No pitch detail"}
                                  {atBat.countAtResult ? ` • ${atBat.countAtResult}` : ""}
                                  {atBat.rbi !== null ? ` • ${atBat.rbi} RBI` : ""}
                                </p>
                              ) : null}
                              {atBat.notes ? <p className="mt-2 text-default-500">{atBat.notes}</p> : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : null}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Drawer
        isOpen={drawerOpen}
        onOpenChange={(open) => setDrawerOpen(open)}
        placement="bottom"
        size="full"
        scrollBehavior="inside"
      >
        <DrawerContent>
          <DrawerHeader className="border-b border-black/5 dark:border-white/10">
            <div className="flex w-full items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-default-500">
                  {drawerMode === "edit" ? "Edit entry" : "New journal entry"}
                </p>
                <h2 className="text-lg font-semibold">
                  {draft.entryType === "throwing" ? "Throwing journal" : "Hitting journal"}
                </h2>
              </div>
              {drawerMode === "create" ? (
                <Tabs
                  selectedKey={draft.entryType}
                  onSelectionChange={(key) =>
                    setDraft(
                      String(key) === "throwing"
                        ? createThrowingEntry(playerId)
                        : createHittingEntry(playerId)
                    )
                  }
                  size="sm"
                  radius="full"
                  color="primary"
                  variant="bordered"
                >
                  <Tab key="throwing" title="Throwing" />
                  <Tab key="hitting" title="Hitting" />
                </Tabs>
              ) : null}
            </div>
          </DrawerHeader>
          <DrawerBody className="mx-auto w-full max-w-2xl gap-4 px-4 py-4">
            {draft.entryType === "throwing" ? (
              <ThrowingJournalForm
                value={draft as CreateThrowingJournalEntryInput}
                onChange={(next) => setDraft(next)}
              />
            ) : (
              <HittingJournalForm
                value={draft as CreateHittingJournalEntryInput}
                onChange={(next) => setDraft(next)}
              />
            )}
            <div className="sticky bottom-0 mt-2 flex gap-3 border-t border-black/5 bg-background/95 px-1 py-4 backdrop-blur dark:border-white/10">
              <Button variant="flat" className="flex-1" onPress={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" className="flex-1" onPress={submitDraft}>
                {drawerMode === "edit" ? "Save changes" : "Save entry"}
              </Button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <ModalContent>
          <ModalHeader>Delete entry?</ModalHeader>
          <ModalBody>
            <p className="text-sm text-default-500">
              This will permanently remove the {deleteTarget?.entryType ?? "journal"} entry from the feed.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

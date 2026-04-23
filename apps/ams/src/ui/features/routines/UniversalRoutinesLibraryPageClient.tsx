"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Switch,
  Tab,
  Tabs,
} from "@heroui/react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { parseRoutineSummary } from "@ams/application/players/development/documentDataParsers";
import type { AppRole } from "@/application/auth/auth-context";
import {
  RoutineViewData,
  RoutineViewModal,
} from "@/ui/features/routines/RoutineViewModal";

type DisciplineOption = {
  id: string;
  key: string;
  label: string;
};

type UniversalRoutineListItem = {
  id: string;
  createdBy: string;
  createdByName: string | null;
  title: string;
  description: string | null;
  routineType: "partial_lesson" | "full_lesson" | "progression";
  disciplineId: string;
  disciplineKey: string;
  disciplineLabel: string;
  isActive: boolean;
  sortOrder: number;
  documentData: unknown;
};

type UniversalRoutinesLibraryPageClientProps = {
  routines: UniversalRoutineListItem[];
  disciplineOptions: DisciplineOption[];
  viewerRole: AppRole;
  viewerUserId: string;
};

export function UniversalRoutinesLibraryPageClient({
  routines,
  disciplineOptions,
  viewerRole,
  viewerUserId,
}: UniversalRoutinesLibraryPageClientProps) {
  const [libraryRoutines, setLibraryRoutines] = useState(routines);
  const [query, setQuery] = useState("");
  const [activeDiscipline, setActiveDiscipline] = useState<string>("all");
  const [showInactive, setShowInactive] = useState(false);
  const [isHidingId, setIsHidingId] = useState<string | null>(null);
  const [viewRoutine, setViewRoutine] = useState<RoutineViewData | null>(null);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return libraryRoutines.filter((routine) => {
      const summary = parseRoutineSummary(routine.documentData);
      const matchesDiscipline =
        activeDiscipline === "all" || routine.disciplineId === activeDiscipline;
      const matchesActivity = showInactive || routine.isActive;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        routine.title.toLowerCase().includes(normalizedQuery) ||
        (routine.description ?? "").toLowerCase().includes(normalizedQuery) ||
        (summary.summary ?? "").toLowerCase().includes(normalizedQuery) ||
        summary.mechanicPreview.some((mechanic) =>
          mechanic.toLowerCase().includes(normalizedQuery)
        );

      return matchesDiscipline && matchesActivity && matchesQuery;
    });
  }, [activeDiscipline, libraryRoutines, query, showInactive]);

  async function hideRoutine(routineId: string) {
    const confirmed = window.confirm("Hide this universal routine from the active library?");
    if (!confirmed) {
      return;
    }

    setIsHidingId(routineId);

    try {
      const response = await fetch(`/api/universal-routines/${routineId}`, {
        method: "DELETE",
      });
      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "Failed to hide universal routine.");
      }

      setLibraryRoutines((current) =>
        current.map((routine) =>
          routine.id === routineId ? { ...routine, isActive: false } : routine
        )
      );
      toast.success("Universal routine hidden from the active library.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to hide universal routine."
      );
    } finally {
      setIsHidingId(null);
    }
  }

  function openRoutineView(routine: UniversalRoutineListItem) {
    setViewRoutine({
      id: routine.id,
      title: routine.title,
      description: routine.description,
      routineType: routine.routineType,
      sourceLabel: "Universal Routine",
      disciplineLabel: routine.disciplineLabel,
      documentData: routine.documentData,
    });
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Routines</h1>
            <p className="text-sm text-foreground-500">
              Create reusable routines that coaches in your facility can assign into player development plans.
            </p>
          </div>

          <Button as={Link} href="/resources/routines/new" color="primary">
            New Routine
          </Button>
        </div>

        <Tabs
          selectedKey={activeDiscipline}
          onSelectionChange={(key) => setActiveDiscipline(String(key))}
          variant="underlined"
          className="border-b border-divider"
        >
          <Tab key="all" title="All" />
          {disciplineOptions.map((discipline) => (
            <Tab key={discipline.id} title={discipline.label} />
          ))}
        </Tabs>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search routines by title, summary, or mechanic"
            startContent={<Search className="h-4 w-4 text-foreground-500" />}
            value={query}
            onValueChange={setQuery}
            className="sm:max-w-md"
          />

          {viewerRole === "admin" ? (
            <Switch isSelected={showInactive} onValueChange={setShowInactive}>
              Show hidden routines
            </Switch>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((routine) => {
            const summary = parseRoutineSummary(routine.documentData);
            const canEdit =
              viewerRole === "admin" || routine.createdBy === viewerUserId;

            return (
              <Card key={routine.id} shadow="sm">
                <CardBody className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold">{routine.title}</h2>
                      {routine.description ? (
                        <p className="text-sm text-foreground-500">
                          {routine.description}
                        </p>
                      ) : null}
                    </div>
                    <Chip size="sm" variant="flat">
                      {routine.routineType.replaceAll("_", " ")}
                    </Chip>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Chip size="sm" variant="bordered">
                      {routine.disciplineLabel}
                    </Chip>
                    <Chip size="sm" variant="bordered">
                      {routine.isActive ? "Active" : "Hidden"}
                    </Chip>
                    <Chip size="sm" variant="bordered">
                      Blocks: {summary.blockCount}
                    </Chip>
                    <Chip size="sm" variant="bordered">
                      Created by {routine.createdByName ?? "Unknown"}
                    </Chip>
                  </div>

                  {summary.summary ? (
                    <p className="text-sm text-foreground-600">{summary.summary}</p>
                  ) : null}

                  {summary.mechanicPreview.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {summary.mechanicPreview.map((mechanic) => (
                        <Chip key={mechanic} size="sm" variant="flat">
                          {mechanic}
                        </Chip>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button variant="flat" onPress={() => openRoutineView(routine)}>
                      View Routine
                    </Button>
                    <Button
                      as={Link}
                      href={`/resources/routines/${routine.id}/edit`}
                      variant="flat"
                      isDisabled={!canEdit}
                    >
                      Edit Routine
                    </Button>
                    {viewerRole === "admin" && routine.isActive ? (
                      <Button
                        color="danger"
                        variant="flat"
                        onPress={() => hideRoutine(routine.id)}
                        isLoading={isHidingId === routine.id}
                      >
                        Hide Routine
                      </Button>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-md border border-dashed border-default-300 p-6 text-center text-sm text-foreground-500">
            No routines found.
          </p>
        ) : null}
      </div>

      <RoutineViewModal
        isOpen={viewRoutine !== null}
        onClose={() => setViewRoutine(null)}
        routine={viewRoutine}
      />
    </>
  );
}

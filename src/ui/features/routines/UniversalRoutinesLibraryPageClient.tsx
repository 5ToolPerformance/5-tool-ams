"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button, Card, CardBody, Chip, Input, Tab, Tabs } from "@heroui/react";
import { Search } from "lucide-react";

import { parseRoutineSummary } from "@/application/players/development/documentDataParsers";
import type { AppRole } from "@/lib/auth/auth-context";

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
  const [query, setQuery] = useState("");
  const [activeDiscipline, setActiveDiscipline] =
    useState<string>("all");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return routines.filter((routine) => {
      const summary = parseRoutineSummary(routine.documentData);
      const matchesDiscipline =
        activeDiscipline === "all" || routine.disciplineId === activeDiscipline;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        routine.title.toLowerCase().includes(normalizedQuery) ||
        (routine.description ?? "").toLowerCase().includes(normalizedQuery) ||
        (summary.summary ?? "").toLowerCase().includes(normalizedQuery) ||
        summary.mechanicPreview.some((mechanic) =>
          mechanic.toLowerCase().includes(normalizedQuery)
        );

      return matchesDiscipline && matchesQuery;
    });
  }, [activeDiscipline, query, routines]);

  return (
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

      <Input
        placeholder="Search routines by title, summary, or mechanic"
        startContent={<Search className="h-4 w-4 text-foreground-500" />}
        value={query}
        onValueChange={setQuery}
      />

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
                    {routine.isActive ? "Active" : "Inactive"}
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

                <div className="flex gap-2">
                  <Button
                    as={Link}
                    href={`/resources/routines/${routine.id}/edit`}
                    variant="flat"
                    isDisabled={!canEdit}
                  >
                    Edit Routine
                  </Button>
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
  );
}

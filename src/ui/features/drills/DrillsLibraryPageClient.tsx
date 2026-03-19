"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button, Input, Tab, Tabs } from "@heroui/react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import type { AppRole } from "@/lib/auth/auth-context";

import { DrillCard } from "@/ui/features/drills/DrillCard";
import { DrillViewModal } from "@/ui/features/drills/DrillViewModal";
import { Drill, DrillDiscipline, DrillListItem } from "@/ui/features/drills/types";

type DrillsLibraryPageClientProps = {
  drills: DrillListItem[];
  viewerRole: AppRole;
};

const DISCIPLINE_ORDER: Record<DrillListItem["discipline"], number> = {
  hitting: 0,
  pitching: 1,
  strength: 2,
  fielding: 3,
  catching: 4,
  arm_care: 5,
};

const DISCIPLINE_LABELS: Record<DrillDiscipline, string> = {
  hitting: "Hitting",
  pitching: "Pitching",
  strength: "Strength",
  fielding: "Fielding",
  catching: "Catching",
  arm_care: "Arm Care",
};

type FilterKey = "all" | DrillDiscipline;

export function DrillsLibraryPageClient({
  drills,
  viewerRole,
}: DrillsLibraryPageClientProps) {
  const [libraryDrills, setLibraryDrills] = useState(drills);
  const [query, setQuery] = useState("");
  const [activeDiscipline, setActiveDiscipline] = useState<FilterKey>("all");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLibraryDrills(drills);
  }, [drills]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filteredRows = libraryDrills.filter((drill) => {
      const matchesDiscipline =
        activeDiscipline === "all" || drill.discipline === activeDiscipline;
      const matchesQuery =
        normalized.length === 0 ||
        drill.title.toLowerCase().includes(normalized) ||
        drill.tags.some((tag) => tag.toLowerCase().includes(normalized));

      return matchesDiscipline && matchesQuery;
    });

    return [...filteredRows].sort((a, b) => {
      const orderDiff = DISCIPLINE_ORDER[a.discipline] - DISCIPLINE_ORDER[b.discipline];
      if (orderDiff !== 0) return orderDiff;
      return a.title.localeCompare(b.title);
    });
  }, [activeDiscipline, libraryDrills, query]);

  async function openDrillView(drillId: string) {
    setIsViewOpen(true);
    setIsLoadingView(true);
    setViewError(null);
    setSelectedDrill(null);

    try {
      const res = await fetch(`/api/drills/${drillId}`);
      const data = (await res.json().catch(() => null)) as
        | { drill?: Drill; error?: string }
        | null;

      if (!res.ok || !data?.drill) {
        throw new Error(data?.error ?? "Failed to load drill");
      }

      setSelectedDrill(data.drill);
    } catch (error) {
      setViewError(error instanceof Error ? error.message : "Failed to load drill");
    } finally {
      setIsLoadingView(false);
    }
  }

  async function deleteDrill(drillId: string) {
    if (viewerRole !== "admin") {
      return;
    }

    const confirmed = window.confirm("Delete this drill?");
    if (!confirmed) return;

    setIsDeletingId(drillId);

    try {
      const res = await fetch(`/api/drills/${drillId}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to delete drill");
      }

      setLibraryDrills((current) => current.filter((drill) => drill.id !== drillId));
      if (selectedDrill?.id === drillId) {
        setSelectedDrill(null);
        setIsViewOpen(false);
      }
      toast.success("Drill deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete drill");
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Drills</h1>
            <p className="text-sm text-foreground-500">
              Create and maintain drills with YouTube video references, discipline filters, and tags.
            </p>
          </div>

          <Button as={Link} href="/resources/drills/new" color="primary">
            New Drill
          </Button>
        </div>

        <Tabs
          selectedKey={activeDiscipline}
          onSelectionChange={(key) => setActiveDiscipline(String(key) as FilterKey)}
          variant="underlined"
          className="border-b border-divider"
        >
          <Tab key="all" title="All" />
          {Object.entries(DISCIPLINE_LABELS).map(([key, label]) => (
            <Tab key={key} title={label} />
          ))}
        </Tabs>

        <Input
          placeholder="Search drills by name or tag"
          startContent={<Search className="h-4 w-4 text-foreground-500" />}
          value={query}
          onValueChange={setQuery}
        />

        <div className="max-h-[65vh] overflow-y-scroll rounded-lg border border-default-200 bg-content1 p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((drill) => (
              <DrillCard
                key={drill.id}
                drill={drill}
                onView={openDrillView}
                onDelete={viewerRole === "admin" ? deleteDrill : undefined}
                isDeleting={isDeletingId === drill.id}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="rounded-md border border-dashed border-default-300 p-6 text-center text-sm text-foreground-500">
              No drills found.
            </p>
          )}
        </div>
      </div>

      <DrillViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        isLoading={isLoadingView}
        error={viewError}
        drill={selectedDrill}
      />
    </>
  );
}

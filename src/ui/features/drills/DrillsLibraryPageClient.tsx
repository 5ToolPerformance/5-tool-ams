"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button, Input } from "@heroui/react";
import { Search } from "lucide-react";

import { DrillCard } from "@/ui/features/drills/DrillCard";
import { DrillViewModal } from "@/ui/features/drills/DrillViewModal";
import { Drill, DrillListItem } from "@/ui/features/drills/types";

type DrillsLibraryPageClientProps = {
  drills: DrillListItem[];
};

const DISCIPLINE_ORDER: Record<DrillListItem["discipline"], number> = {
  hitting: 0,
  pitching: 1,
  strength: 2,
  fielding: 3,
  catching: 4,
  arm_care: 5,
};

export function DrillsLibraryPageClient({ drills }: DrillsLibraryPageClientProps) {
  const [query, setQuery] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filteredRows = normalized
      ? drills.filter(
          (drill) =>
            drill.title.toLowerCase().includes(normalized) ||
            drill.discipline.toLowerCase().includes(normalized) ||
            drill.tags.some((tag) => tag.includes(normalized))
        )
      : drills;

    return [...filteredRows].sort((a, b) => {
      const orderDiff = DISCIPLINE_ORDER[a.discipline] - DISCIPLINE_ORDER[b.discipline];
      if (orderDiff !== 0) return orderDiff;
      return a.title.localeCompare(b.title);
    });
  }, [drills, query]);

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

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Drills</h1>
            <p className="text-sm text-foreground-500">
              Create and maintain drills with video and image references.
            </p>
          </div>

          <Button as={Link} href="/drills/new" color="primary">
            New Drill
          </Button>
        </div>

        <Input
          placeholder="Search drills by title, discipline, or tag"
          startContent={<Search className="h-4 w-4 text-foreground-500" />}
          value={query}
          onValueChange={setQuery}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((drill) => (
            <DrillCard key={drill.id} drill={drill} onView={openDrillView} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="rounded-md border border-dashed border-default-300 p-6 text-center text-sm text-foreground-500">
            No drills found.
          </p>
        )}
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

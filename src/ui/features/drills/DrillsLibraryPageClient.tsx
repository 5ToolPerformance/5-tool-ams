"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button, Card, CardBody, Chip, Input } from "@heroui/react";
import { Search } from "lucide-react";

import { DrillListItem } from "@/ui/features/drills/types";

type DrillsLibraryPageClientProps = {
  drills: DrillListItem[];
};

export function DrillsLibraryPageClient({ drills }: DrillsLibraryPageClientProps) {
  const [query, setQuery] = useState("");
  const formatDiscipline = (value: DrillListItem["discipline"]) =>
    value === "arm_care"
      ? "Arm Care"
      : `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return drills;

    return drills.filter(
      (drill) =>
        drill.title.toLowerCase().includes(normalized) ||
        drill.discipline.toLowerCase().includes(normalized) ||
        drill.tags.some((tag) => tag.includes(normalized))
    );
  }, [drills, query]);

  return (
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

      <div className="grid gap-4">
        {filtered.map((drill) => (
          <Card key={drill.id}>
            <CardBody className="space-y-3">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{drill.title}</h2>
                  <p className="text-sm text-foreground-500">{drill.description}</p>
                  <p className="text-xs text-foreground-400">
                    By {drill.createdBy.name ?? "Unknown"} • Updated{" "}
                    {new Date(drill.updatedOn).toLocaleDateString()}
                  </p>
                </div>

                {drill.canEdit ? (
                  <Button as={Link} href={`/drills/${drill.id}/edit`} size="sm" variant="flat">
                    Edit
                  </Button>
                ) : (
                  <Chip size="sm" variant="flat">
                    Read only
                  </Chip>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Chip size="sm" color="secondary" variant="flat">
                  {formatDiscipline(drill.discipline)}
                </Chip>
                {drill.tags.map((tag) => (
                  <Chip key={`${drill.id}-${tag}`} size="sm" variant="flat">
                    {tag}
                  </Chip>
                ))}
                <Chip size="sm" color="primary" variant="flat">
                  {drill.mediaCount} media
                </Chip>
              </div>
            </CardBody>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="rounded-md border border-dashed border-default-300 p-6 text-center text-sm text-foreground-500">
            No drills found.
          </p>
        )}
      </div>
    </div>
  );
}

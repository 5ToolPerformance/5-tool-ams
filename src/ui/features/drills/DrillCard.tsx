"use client";

import Link from "next/link";

import { Button, Card, CardBody, Chip } from "@heroui/react";

import { DrillListItem } from "@/ui/features/drills/types";

type DrillCardProps = {
  drill: DrillListItem;
  onView: (drillId: string) => void;
  thumbnailUrl?: string | null;
};

function formatDiscipline(value: DrillListItem["discipline"]) {
  return value === "arm_care"
    ? "Arm Care"
    : `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function DrillCard({ drill, onView, thumbnailUrl }: DrillCardProps) {
  return (
    <Card className="h-full">
      <CardBody className="flex h-full flex-col gap-3">
        <div className="overflow-hidden rounded-md border border-default-200">
          {thumbnailUrl ? (
            <div
              className="h-32 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
            />
          ) : (
            <div className="flex h-32 w-full items-center justify-center bg-default-100 text-xs text-foreground-500">
              Thumbnail coming soon
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h2 className="line-clamp-2 text-lg font-semibold">{drill.title}</h2>
          <p className="line-clamp-2 text-sm text-foreground-500">
            {drill.description}
          </p>
          <p className="text-xs text-foreground-400">
            By {drill.createdBy.name ?? "Unknown"} • Updated{" "}
            {new Date(drill.updatedOn).toLocaleDateString()}
          </p>
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

        <div className="mt-auto flex items-center gap-2">
          <Button size="sm" variant="bordered" onPress={() => onView(drill.id)}>
            View
          </Button>
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
      </CardBody>
    </Card>
  );
}

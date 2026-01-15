"use client";

import { Button } from "@heroui/react";
import { Pencil, Plus } from "lucide-react";

interface AthleteQuickActionsProps {
  canEdit?: boolean;
}

export function AthleteQuickActions({ canEdit }: AthleteQuickActionsProps) {
  return (
    <div className="flex gap-2">
      <Button size="sm" color="primary" startContent={<Plus size={16} />}>
        Add Lesson
      </Button>

      {canEdit && (
        <Button size="sm" variant="flat" startContent={<Pencil size={16} />}>
          Edit Player
        </Button>
      )}
    </div>
  );
}

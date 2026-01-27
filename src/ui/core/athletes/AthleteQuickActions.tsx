"use client";

import { Button } from "@heroui/react";
import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface AthleteQuickActionsProps {
  canEdit?: boolean;
  playerId?: string;
}

export function AthleteQuickActions({ canEdit, playerId }: AthleteQuickActionsProps) {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <Button size="sm" color="primary" startContent={<Plus size={16} />} onPress={() => router.push(`/lessons/new?playerId=${playerId}`)}>
        Add Lesson
      </Button>

      <Button size="sm" color="primary" startContent={<Plus size={16} />}>
        Add Note
      </Button>

      {canEdit && (
        <Button size="sm" variant="flat" startContent={<Pencil size={16} />}>
          Edit Player
        </Button>
      )}
    </div>
  );
}

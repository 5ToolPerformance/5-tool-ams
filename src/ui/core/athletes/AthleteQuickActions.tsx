"use client";

import { useRouter } from "next/navigation";

import { Button } from "@heroui/react";
import { Pencil, Plus } from "lucide-react";

import { PlayerHeaderModel } from "@/domain/player/header/types";
import { usePlayerHeaderRefetch } from "@/hooks/usePlayerHeaderRefetch";
import { AddPlayerInjuryModal } from "@/ui/core/athletes/AddPlayerInjuryModal";
import { EditPlayerConfigModal } from "@/ui/core/athletes/EditPlayerConfigModal";
import { PlayerUploadDataModal } from "@/ui/core/athletes/PlayerUploadDataModal";

import { AddPlayerNoteModal } from "./AddPlayerNoteModal";

interface AthleteQuickActionsProps {
  canEdit?: boolean;
  player: PlayerHeaderModel;
  onPlayerUpdated?: () => void;
}

export function AthleteQuickActions({
  canEdit,
  player,
  onPlayerUpdated,
}: AthleteQuickActionsProps) {
  const router = useRouter();
  const refetchHeader = usePlayerHeaderRefetch();
  const playerId = player.id;
  const buttonClassName = "w-full justify-center";

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
      <Button
        size="sm"
        color="primary"
        className={buttonClassName}
        startContent={<Plus size={16} />}
        onPress={() => router.push(`/lessons/new?playerId=${playerId}`)}
      >
        Add Lesson
      </Button>

      <AddPlayerNoteModal
        playerId={playerId}
        trigger={
          <Button
            size="sm"
            color="primary"
            className={buttonClassName}
            startContent={<Plus size={16} />}
          >
            Add Note
          </Button>
        }
      />

      <PlayerUploadDataModal
        playerId={playerId}
        trigger={
          <Button
            size="sm"
            color="primary"
            className={buttonClassName}
            startContent={<Plus size={16} />}
          >
            Upload Data
          </Button>
        }
      />

      <AddPlayerInjuryModal
        playerId={playerId}
        trigger={
          <Button
            size="sm"
            color="primary"
            className={buttonClassName}
            startContent={<Plus size={16} />}
          >
            Add Injury
          </Button>
        }
      />

      {canEdit && (
        <EditPlayerConfigModal
          player={player}
          onSuccess={() => {
            refetchHeader();
            onPlayerUpdated?.();
          }}
          trigger={
            <Button
              size="sm"
              variant="flat"
              className={buttonClassName}
              startContent={<Pencil size={16} />}
            >
              Edit Player
            </Button>
          }
        />
      )}
    </div>
  );
}

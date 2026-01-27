"use client";

import { ReactElement } from "react";

import { useDisclosure } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";

import { PlayerHeaderModel } from "@/domain/player/header/types";
import { useCoaches } from "@/hooks";
import { PlayerSelect } from "@/types/database";

interface PlayerUpsertModalProps {
  player?: PlayerHeaderModel;
  trigger: ReactElement<{ onPress?: () => void }>;
  onSuccess?: (player: PlayerSelect) => void;
}

/* ---------------- helpers ---------------- */

const formatDateForDB = (calendarDate: CalendarDate) => {
  const year = calendarDate.year;
  const month = String(calendarDate.month).padStart(2, "0");
  const day = String(calendarDate.day).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toCalendarDate = (value?: string | Date | null) => {
  if (!value) return parseDate(new Date().toISOString().split("T")[0]);
  if (value instanceof Date) {
    return parseDate(value.toISOString().split("T")[0]);
  }
  return parseDate(value);
};

/* ---------------- component ---------------- */

export function PlayerUpsertModal({
  player,
  trigger,
  onSuccess,
}: PlayerUpsertModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isEdit = Boolean(player);
  const { coaches, isLoading: coachesLoading } = useCoaches();
  if (player) {
    const primary = player.positions.find((p) => p.isPrimary);
    const secondary = player.positions.filter((p) => !p.isPrimary);
  }
}

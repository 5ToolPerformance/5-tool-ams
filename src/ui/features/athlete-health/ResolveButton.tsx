"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import { toast } from "sonner";

import { usePlayerInjuries } from "@/hooks/injuries/usePlayerInjuries";
import { useRouteRefetch } from "@/hooks/useRotueRefetch";
import { useParams } from "next/navigation";

interface ResolveButtonProps {
  injuryId: string;
}

export function ResolveButton({ injuryId }: ResolveButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{ playerId: string }>();
  const playerId = params.playerId;
  const { refresh } = usePlayerInjuries(playerId);
  const refetch = useRouteRefetch();

  async function resolveInjury() {
    if (!playerId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/injuries/${injuryId}/resolve`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Failed to resolve injury");
      }

      await refresh();
      refetch();
      toast.success("Injury marked as resolved");
    } catch (error) {
      console.error(error);
      toast.error("Unable to resolve injury");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      variant="flat"
      color="primary"
      onPress={resolveInjury}
      isLoading={isSubmitting}
      className="w-full sm:w-auto"
    >
      Resolve Injury
    </Button>
  );
}

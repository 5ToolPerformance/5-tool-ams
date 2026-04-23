"use client";

import { useState } from "react";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Link as LinkIcon, Search, User } from "lucide-react";

import { usePlayers } from "@/hooks";

type ExternalSystem = "hawkin" | "armcare" | "trackman" | "hittrax";

interface ExternalAthlete {
  externalId: string;
  displayName?: string | null;
}

interface ExternalLinkPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;

  externalSystem: ExternalSystem;
  externalAthlete: ExternalAthlete | null;
}

export function ExternalLinkPlayerDialog({
  isOpen,
  onClose,
  onSuccess,
  externalSystem,
  externalAthlete,
}: ExternalLinkPlayerDialogProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [isLinking, setIsLinking] = useState<boolean>(false);

  const { players, isLoading, error } = usePlayers();

  const handleLink = async () => {
    if (!selectedPlayerId || !externalAthlete) return;

    setIsLinking(true);

    try {
      const response = await fetch("/api/admin/external-athlete-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: selectedPlayerId,
          externalSystem,
          externalId: externalAthlete.externalId,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to link athlete");
      }

      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Link error:", err);
      alert("Failed to link athlete");
    } finally {
      setIsLinking(false);
    }
  };

  const handleClose = () => {
    if (isLinking) return;
    setSelectedPlayerId("");
    onClose();
  };

  if (!externalAthlete) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>Link External Athlete</ModalHeader>

        <ModalBody className="space-y-6">
          {/* External Athlete Info */}
          <div className="rounded-lg bg-default-100 p-4">
            <div className="mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-default-500" />
              <h3 className="font-semibold capitalize">
                {externalSystem} Athlete
              </h3>
            </div>

            <div className="space-y-1 text-sm">
              {externalAthlete.displayName && (
                <div>
                  <span className="text-default-500">Name:</span>{" "}
                  <span className="font-medium">
                    {externalAthlete.displayName}
                  </span>
                </div>
              )}
              <div>
                <span className="text-default-500">External ID:</span>{" "}
                <code className="rounded bg-default-200 px-2 py-1 text-xs">
                  {externalAthlete.externalId}
                </code>
              </div>
            </div>
          </div>

          {/* Player Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Select Internal Player
            </label>

            {error && (
              <p className="mb-2 text-sm text-danger">Failed to load players</p>
            )}

            <Autocomplete
              placeholder="Search for a player..."
              isLoading={isLoading}
              selectedKey={selectedPlayerId}
              onSelectionChange={(key) => setSelectedPlayerId(key as string)}
              startContent={<Search className="h-4 w-4 text-default-400" />}
              classNames={{
                base: "w-full",
                listboxWrapper: "max-h-[320px]",
              }}
            >
              {players?.map((player) => (
                <AutocompleteItem
                  key={player.id}
                  textValue={`${player.firstName} ${player.lastName}`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {player.firstName} {player.lastName}
                    </span>
                    <span className="text-xs text-default-400">
                      {player.id}
                    </span>
                  </div>
                </AutocompleteItem>
              )) ?? []}
            </Autocomplete>
          </div>

          {/* Warning */}
          <div className="rounded-lg border border-warning-200 bg-warning-50 p-3">
            <p className="text-sm text-warning-800">
              <strong>Note:</strong> This creates a permanent link between this
              external athlete and the selected internal player.
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={handleClose} isDisabled={isLinking}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleLink}
            isDisabled={!selectedPlayerId}
            isLoading={isLinking}
            startContent={!isLinking && <LinkIcon className="h-4 w-4" />}
          >
            Link Player
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

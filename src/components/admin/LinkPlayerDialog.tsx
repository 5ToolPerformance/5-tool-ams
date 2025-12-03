"use client";

import { useState } from "react";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Link as LinkIcon, Search, User } from "lucide-react";

import { usePlayers } from "@/hooks";

interface LinkPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  armcarePlayer: {
    externalPlayerId: string;
    externalFirstName: string;
    externalLastName: string;
    externalEmail: string | null;
    examCount: number;
  } | null;
  onSuccess: () => void;
}

export function LinkPlayerDialog({
  isOpen,
  onClose,
  armcarePlayer,
  onSuccess,
}: LinkPlayerDialogProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [isLinking, setIsLinking] = useState(false);

  const { players: playersData, isLoading, error } = usePlayers();

  console.log(playersData);

  const handleLink = async () => {
    if (!selectedPlayerId || !armcarePlayer) return;

    setIsLinking(true);

    try {
      const response = await fetch("/api/admin/unmatched-exams/link-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          externalPlayerId: armcarePlayer.externalPlayerId,
          pathPlayerId: selectedPlayerId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSuccess();
        onClose();
        setSelectedPlayerId("");
      } else {
        alert(`Failed to link player: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Link error:", error);
      alert("Failed to link player");
    } finally {
      setIsLinking(false);
    }
  };

  const handleClose = () => {
    if (!isLinking) {
      setSelectedPlayerId("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Link ArmCare Player to PATH Player
        </ModalHeader>
        <ModalBody>
          {armcarePlayer && (
            <div className="space-y-6">
              {/* ArmCare Player Info */}
              <div className="rounded-lg bg-default-100 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-default-500" />
                  <h3 className="font-semibold">ArmCare Player</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-default-500">Name:</span>{" "}
                    <span className="font-medium">
                      {armcarePlayer.externalFirstName}{" "}
                      {armcarePlayer.externalLastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-default-500">ArmCare ID:</span>{" "}
                    <code className="rounded bg-default-200 px-2 py-1 text-xs">
                      {armcarePlayer.externalPlayerId}
                    </code>
                  </div>
                  {armcarePlayer.externalEmail && (
                    <div>
                      <span className="text-default-500">Email:</span>{" "}
                      <span>{armcarePlayer.externalEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-default-500">Unmatched Exams:</span>
                    <Chip size="sm" color="warning" variant="flat">
                      {armcarePlayer.examCount}
                    </Chip>
                  </div>
                </div>
              </div>

              {/* PATH Player Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select PATH Player
                </label>
                <Autocomplete
                  placeholder="Search for a player..."
                  isLoading={isLoading}
                  selectedKey={selectedPlayerId}
                  onSelectionChange={(key) => {
                    setSelectedPlayerId(key as string);
                  }}
                  startContent={<Search className="h-4 w-4 text-default-400" />}
                  classNames={{
                    base: "w-full",
                    listboxWrapper: "max-h-[320px]",
                  }}
                  listboxProps={{
                    emptyContent: "No players found",
                  }}
                  inputProps={{
                    classNames: {
                      inputWrapper: "h-12",
                    },
                  }}
                >
                  {playersData?.map((player: any) => (
                    <AutocompleteItem
                      key={player.id}
                      textValue={player.firstName + " " + player.lastName}
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
                  )) || []}
                </Autocomplete>

                <p className="mt-2 text-xs text-default-500">
                  All {armcarePlayer.examCount} unmatched exam(s) will be linked
                  to this player
                </p>
              </div>

              {/* Warning */}
              <div className="rounded-lg border border-warning-200 bg-warning-50 p-3">
                <p className="text-sm text-warning-800">
                  <strong>Note:</strong> This will create a permanent link
                  between the ArmCare player and the selected PATH player.
                  Future syncs will automatically match this player.
                </p>
              </div>
            </div>
          )}
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
            {isLinking ? "Linking..." : "Link Player"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

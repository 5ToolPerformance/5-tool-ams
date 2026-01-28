"use client";

import { ReactElement, cloneElement, useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { toast } from "sonner";

import { NOTE_TYPES } from "@/domain/player/notes/constants";
import { usePlayerNotes } from "@/hooks";

interface AddPlayerNoteModalProps {
  playerId: string;
  trigger: ReactElement<{ onPress?: () => void }>;
}

export function AddPlayerNoteModal({
  playerId,
  trigger,
}: AddPlayerNoteModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refresh } = usePlayerNotes(playerId);
  const [type, setType] = useState<string>("general");

  const submit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/player-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, content, type }),
      });

      if (!res.ok) {
        throw new Error("Failed to create note");
      }

      setContent("");
      refresh();
      onOpenChange();
      toast.success("Note added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      {cloneElement(trigger, {
        onPress: onOpen,
      })}

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Player Note</ModalHeader>

              <ModalBody>
                <Select
                  label="Note Type"
                  selectedKeys={[type]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setType(selected);
                  }}
                >
                  {NOTE_TYPES.map((t) => (
                    <SelectItem key={t.key}>{t.label}</SelectItem>
                  ))}
                </Select>
                <Textarea
                  label="Note"
                  placeholder="Parent conversation, follow-ups, context…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  minRows={5}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onClose}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={submit}
                  isLoading={isSubmitting}
                >
                  Save Note
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

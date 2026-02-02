"use client";

import { cloneElement, useState } from "react";

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

interface PlayerUploadDataModalProps {
  playerId: string;
  trigger: React.ReactElement<{ onPress?: () => void }>;
  onSuccess?: () => void;
}

export function PlayerUploadDataModal({
  playerId,
  trigger,
  onSuccess,
}: PlayerUploadDataModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /* ---------- state ---------- */

  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"file_csv" | "file_video">("file_csv");
  const [source, setSource] = useState<string>("hitrax");
  const [notes, setNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- submit ---------- */

  const submit = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("athleteId", playerId);
      formData.append("type", type);
      formData.append("source", source);

      if (notes.trim()) {
        formData.append("notes", notes);
      }

      const res = await fetch("/api/attachments/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Upload failed");
      }

      toast.success("Data uploaded successfully");
      onSuccess?.();
      onOpenChange();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload data");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- render ---------- */

  return (
    <>
      {cloneElement(trigger, { onPress: onOpen })}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Upload Data</ModalHeader>

              <ModalBody className="space-y-4">
                {/* File */}
                <input
                  type="file"
                  accept={type === "file_csv" ? ".csv" : "video/*"}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                {/* Type */}
                <Select
                  label="Data Type"
                  selectedKeys={[type]}
                  onSelectionChange={(keys) =>
                    setType(Array.from(keys)[0] as "file_csv" | "file_video")
                  }
                >
                  <SelectItem key="file_csv">CSV (Session Data)</SelectItem>
                  <SelectItem key="file_video">Video</SelectItem>
                </Select>

                {/* Source */}
                <Select
                  label="Source"
                  selectedKeys={[source]}
                  onSelectionChange={(keys) =>
                    setSource(Array.from(keys)[0] as string)
                  }
                >
                  <SelectItem key="hitrax">HitTrax</SelectItem>
                  <SelectItem key="blast_motion">Blast Motion</SelectItem>
                  <SelectItem key="manual">Manual / Other</SelectItem>
                </Select>

                {/* Notes */}
                <Textarea
                  label="Notes"
                  placeholder="Optional notes about this upload"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  onPress={submit}
                >
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

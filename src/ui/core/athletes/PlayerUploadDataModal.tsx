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

import { useRouteRefetch } from "@/hooks/useRotueRefetch";

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
  const [uploadKind, setUploadKind] = useState<
    "performance" | "context"
  >("performance");
  const [type, setType] = useState<"file_csv" | "file_video">("file_csv");
  const [source, setSource] = useState<string>("hitrax");
  const [visibility, setVisibility] = useState<
    "internal" | "private" | "public"
  >("internal");
  const [documentType, setDocumentType] = useState<
    "medical" | "pt" | "external" | "eval" | "general" | "other"
  >("general");
  const [notes, setNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const refetch = useRouteRefetch();

  /* ---------- submit ---------- */

  const submit = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (uploadKind === "context" && (!visibility || !documentType)) {
      toast.error("Please select document type and visibility");
      return;
    }

    const resolveContextType = (
      selectedFile: File
    ): "file_image" | "file_pdf" | "file_docx" | null => {
      if (selectedFile.type.startsWith("image/")) {
        return "file_image";
      }

      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.name.toLowerCase().endsWith(".pdf")
      ) {
        return "file_pdf";
      }

      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        selectedFile.name.toLowerCase().endsWith(".docx")
      ) {
        return "file_docx";
      }

      return null;
    };

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("athleteId", playerId);
      if (uploadKind === "context") {
        const contextType = resolveContextType(file);
        if (!contextType) {
          throw new Error("Unsupported context document file type");
        }
        formData.append("type", contextType);
        formData.append("source", "manual");
        formData.append("evidenceCategory", "context");
        formData.append("visibility", visibility);
        formData.append("documentType", documentType);
      } else {
        formData.append("type", type);
        formData.append("source", source);
      }

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
      refetch();
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
                {/* Upload Kind */}
                <Select
                  label="Upload Type"
                  selectedKeys={[uploadKind]}
                  onSelectionChange={(keys) =>
                    setUploadKind((current) => {
                      const next = Array.from(keys)[0] as
                        | "performance"
                        | "context";
                      if (current !== next) {
                        setFile(null);
                      }
                      return next;
                    })
                  }
                >
                  <SelectItem key="performance">Performance Data</SelectItem>
                  <SelectItem key="context">Context Document</SelectItem>
                </Select>

                {/* File */}
                <input
                  type="file"
                  accept={
                    uploadKind === "context"
                      ? "image/*,.pdf,.docx"
                      : type === "file_csv"
                        ? ".csv"
                        : "video/*"
                  }
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                {uploadKind === "performance" && (
                  <>
                    {/* Type */}
                    <Select
                      label="Data Type"
                      selectedKeys={[type]}
                      onSelectionChange={(keys) =>
                        setType(
                          Array.from(keys)[0] as "file_csv" | "file_video"
                        )
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
                  </>
                )}

                {uploadKind === "context" && (
                  <>
                    <Select
                      label="Document Type"
                      selectedKeys={[documentType]}
                      onSelectionChange={(keys) =>
                        setDocumentType(
                          Array.from(keys)[0] as
                            | "medical"
                            | "pt"
                            | "external"
                            | "eval"
                            | "general"
                            | "other"
                        )
                      }
                    >
                      <SelectItem key="medical">Medical</SelectItem>
                      <SelectItem key="pt">PT</SelectItem>
                      <SelectItem key="external">External</SelectItem>
                      <SelectItem key="eval">Eval</SelectItem>
                      <SelectItem key="general">General</SelectItem>
                      <SelectItem key="other">Other</SelectItem>
                    </Select>

                    <Select
                      label="Visibility"
                      selectedKeys={[visibility]}
                      onSelectionChange={(keys) =>
                        setVisibility(
                          Array.from(keys)[0] as "internal" | "private" | "public"
                        )
                      }
                    >
                      <SelectItem key="internal">Internal</SelectItem>
                      <SelectItem key="private">Private</SelectItem>
                      <SelectItem key="public">Public</SelectItem>
                    </Select>
                  </>
                )}

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

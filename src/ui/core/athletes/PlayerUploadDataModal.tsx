"use client";

import { cloneElement, useState } from "react";

import {
  Button,
  Input,
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

  const getTodayDateString = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
  };

  /* ---------- state ---------- */

  const [file, setFile] = useState<File | null>(null);
  const [uploadKind, setUploadKind] = useState<
    "performance" | "media" | "context"
  >("performance");
  const [type] = useState<"file_csv">("file_csv");
  const [source, setSource] = useState<string>("hittrax");
  const [mediaSource, setMediaSource] = useState<
    "hitting" | "pitching" | "fielding" | "strength" | "catching"
  >("hitting");
  const [contextSource, setContextSource] = useState<string>("");
  const [visibility, setVisibility] = useState<
    "internal" | "private" | "public"
  >("internal");
  const [documentType, setDocumentType] = useState<
    "medical" | "pt" | "external" | "eval" | "general" | "other"
  >("general");
  const [effectiveDate, setEffectiveDate] = useState<string>(() =>
    getTodayDateString()
  );
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
    ): "file_pdf" | "file_docx" | null => {
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

    const resolveMediaType = (
      selectedFile: File
    ): "file_image" | "file_video" | null => {
      if (selectedFile.type.startsWith("image/")) {
        return "file_image";
      }
      if (selectedFile.type.startsWith("video/")) {
        return "file_video";
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
        const resolvedSource = contextSource.trim() || "manual";
        formData.append("source", resolvedSource);
        formData.append("evidenceCategory", "context");
        formData.append("visibility", visibility);
        formData.append("documentType", documentType);
        const resolvedEffectiveDate =
          effectiveDate.trim() || getTodayDateString();
        formData.append("effectiveDate", resolvedEffectiveDate);
      } else if (uploadKind === "media") {
        const mediaType = resolveMediaType(file);
        if (!mediaType) {
          throw new Error("Unsupported media file type");
        }
        formData.append("type", mediaType);
        formData.append("source", mediaSource);
        formData.append("evidenceCategory", "media");
      } else {
        formData.append("type", type);
        formData.append("source", source);
        formData.append("evidenceCategory", "performance");
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
                        | "media"
                        | "context";
                      if (current !== next) {
                        setFile(null);
                        setContextSource("");
                        if (next === "context") {
                          setEffectiveDate(getTodayDateString());
                        }
                      }
                      return next;
                    })
                  }
                >
                  <SelectItem key="performance">Performance Data</SelectItem>
                  <SelectItem key="media">Media (Image / Video)</SelectItem>
                  <SelectItem key="context">Context Document</SelectItem>
                </Select>

                {/* File */}
                <input
                  type="file"
                  accept={
                    uploadKind === "context"
                      ? ".pdf,.docx"
                      : uploadKind === "media"
                        ? "image/*,video/*"
                        : ".csv"
                  }
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                {uploadKind === "performance" && (
                  <>
                    {/* Source */}
                    <Select
                      label="Source"
                      selectedKeys={[source]}
                      onSelectionChange={(keys) =>
                        setSource(Array.from(keys)[0] as string)
                      }
                    >
                      <SelectItem key="hittrax">HitTrax</SelectItem>
                      <SelectItem key="blast_motion">Blast Motion</SelectItem>
                      <SelectItem key="manual">Manual / Other</SelectItem>
                    </Select>
                  </>
                )}

                {uploadKind === "media" && (
                  <Select
                    label="Media Source"
                    selectedKeys={[mediaSource]}
                    onSelectionChange={(keys) =>
                      setMediaSource(
                        Array.from(keys)[0] as
                          | "hitting"
                          | "pitching"
                          | "fielding"
                          | "strength"
                          | "catching"
                      )
                    }
                  >
                    <SelectItem key="hitting">Hitting</SelectItem>
                    <SelectItem key="pitching">Pitching</SelectItem>
                    <SelectItem key="fielding">Fielding</SelectItem>
                    <SelectItem key="strength">Strength</SelectItem>
                    <SelectItem key="catching">Catching</SelectItem>
                  </Select>
                )}

                {uploadKind === "context" && (
                  <>
                    <Input
                      label="Source"
                      placeholder="Enter document source"
                      value={contextSource}
                      onChange={(event) => setContextSource(event.target.value)}
                    />
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
                          Array.from(keys)[0] as
                            | "internal"
                            | "private"
                            | "public"
                        )
                      }
                    >
                      <SelectItem key="internal">Internal</SelectItem>
                      <SelectItem key="private">Private</SelectItem>
                      <SelectItem key="public">Public</SelectItem>
                    </Select>

                    <Input
                      type="date"
                      label="Effective Date"
                      value={effectiveDate}
                      onChange={(event) =>
                        setEffectiveDate(event.target.value)
                      }
                    />
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

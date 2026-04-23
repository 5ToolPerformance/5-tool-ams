"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { toast } from "sonner";

import { CSVViewer } from "@/ui/features/attachments/CSVViewer";
import { DocumentViewer } from "@/ui/features/attachments/DocumentViewer";
import { MediaViewer } from "@/ui/features/attachments/MediaViewer";
import {
  getAttachmentDisplayName,
  getAttachmentTypeLabel,
  type AttachmentViewerAttachment,
} from "@/ui/features/attachments/types";

type AttachmentViewerModalProps = {
  isOpen: boolean;
  attachment: AttachmentViewerAttachment | null;
  onClose: () => void;
};

export function AttachmentViewerModal({
  isOpen,
  attachment,
  onClose,
}: AttachmentViewerModalProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const displayName = useMemo(() => {
    if (!attachment) return "Attachment";
    return getAttachmentDisplayName(attachment);
  }, [attachment]);

  const typeLabel = attachment
    ? getAttachmentTypeLabel(attachment.type)
    : "Attachment";

  const canDownload = Boolean(url);
  const streamUrl = attachment
    ? `/api/attachments/${attachment.id}/stream`
    : "";

  useEffect(() => {
    const attachmentId = attachment?.id;
    if (!isOpen || !attachmentId) {
      setUrl(null);
      setIsLoading(false);
      setError(null);
      setRetryCount(0);
      return;
    }

    let cancelled = false;

    async function fetchUrl() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/attachments/${attachmentId}/view`
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "Failed to open attachment");
        }
        const data = (await res.json()) as { url: string };
        if (!cancelled) {
          setUrl(data.url);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Unable to load attachment preview");
          toast.error("Unable to open attachment");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchUrl();

    return () => {
      cancelled = true;
    };
  }, [attachment?.id, isOpen, retryCount]);

  const renderBody = () => {
    if (!attachment) {
      return (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No attachment selected.
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading attachment…
        </div>
      );
    }

    if (error || !url) {
      return (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="text-sm text-muted-foreground">
            {error ?? "Preview not available."}
          </div>
          <Button
            size="sm"
            variant="flat"
            onPress={() => setRetryCount((count) => count + 1)}
          >
            Retry
          </Button>
        </div>
      );
    }

    if (attachment.type === "file_csv") {
      return <CSVViewer attachmentId={attachment.id} />;
    }

    if (attachment.type === "file_video") {
      return (
        <MediaViewer
          streamUrl={streamUrl}
          downloadUrl={url}
          mimeType={attachment.file?.mimeType}
          fileName={attachment.file?.originalFileName}
        />
      );
    }

    return (
      <DocumentViewer attachment={attachment} streamUrl={streamUrl} />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="5xl"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-lg font-semibold">
                    {displayName}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Chip size="sm" variant="flat">
                      {typeLabel}
                    </Chip>
                    <span>{attachment?.source ?? "Unknown source"}</span>
                    {attachment?.effectiveDate && (
                      <span>Effective: {attachment.effectiveDate}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    isDisabled={!canDownload}
                    onPress={() => {
                      if (!url) return;
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    Download
                  </Button>
                  <Button size="sm" onPress={onClose}>
                    Close
                  </Button>
                </div>
              </div>
              <Divider />
            </ModalHeader>

            <ModalBody className="max-h-[70vh] overflow-y-auto">
              {renderBody()}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

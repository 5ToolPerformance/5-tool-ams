"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { AttachmentViewerModal } from "@/ui/features/attachments/AttachmentViewerModal";
import type { AttachmentViewerAttachment } from "@/ui/features/attachments/types";

type AttachmentViewerContextValue = {
  openAttachment: (attachment: AttachmentViewerAttachment) => void;
  closeViewer: () => void;
};

const AttachmentViewerContext =
  createContext<AttachmentViewerContextValue | null>(null);

export function useAttachmentViewer() {
  const context = useContext(AttachmentViewerContext);
  if (!context) {
    throw new Error(
      "useAttachmentViewer must be used within AttachmentViewerProvider"
    );
  }
  return context;
}

export function AttachmentViewerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedAttachment, setSelectedAttachment] =
    useState<AttachmentViewerAttachment | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      openAttachment: (attachment: AttachmentViewerAttachment) => {
        setSelectedAttachment(attachment);
        setIsOpen(true);
      },
      closeViewer: () => {
        setIsOpen(false);
        setSelectedAttachment(null);
      },
    }),
    []
  );

  return (
    <AttachmentViewerContext.Provider value={value}>
      {children}
      <AttachmentViewerModal
        isOpen={isOpen}
        attachment={selectedAttachment}
        onClose={value.closeViewer}
      />
    </AttachmentViewerContext.Provider>
  );
}

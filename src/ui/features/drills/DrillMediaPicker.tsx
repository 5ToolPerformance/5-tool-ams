"use client";

import { Button, Card, CardBody, Chip, Input } from "@heroui/react";

import { DrillMedia } from "@/ui/features/drills/types";

export type PendingUpload = {
  id: string;
  file: File;
  error?: string;
};

type DrillMediaPickerProps = {
  drillId?: string;
  existingMedia: DrillMedia[];
  removeFileIds: string[];
  onToggleRemoveExisting: (fileId: string) => void;
  pendingUploads: PendingUpload[];
  onAddFiles: (files: FileList | null) => void;
  onRemovePending: (id: string) => void;
};

export function DrillMediaPicker({
  drillId,
  existingMedia,
  removeFileIds,
  onToggleRemoveExisting,
  pendingUploads,
  onAddFiles,
  onRemovePending,
}: DrillMediaPickerProps) {
  return (
    <div className="space-y-4">
      <Input
        type="file"
        label="Add Media"
        accept="image/*,video/*"
        onChange={(event) => onAddFiles(event.target.files)}
        multiple
      />

      {existingMedia.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Existing Media</h4>
          {existingMedia.map((media) => {
            const markedForRemoval = removeFileIds.includes(media.fileId);
            const streamUrl = drillId
              ? `/api/drills/${drillId}/files/${media.fileId}/stream`
              : "";
            const isVideo = media.mimeType.startsWith("video/");

            return (
              <Card key={media.fileId} className={markedForRemoval ? "opacity-60" : ""}>
                <CardBody className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm">
                      <p className="font-medium">{media.originalName}</p>
                      <p className="text-foreground-500">{media.mimeType}</p>
                    </div>
                    <Button
                      color={markedForRemoval ? "success" : "danger"}
                      variant="flat"
                      size="sm"
                      onPress={() => onToggleRemoveExisting(media.fileId)}
                    >
                      {markedForRemoval ? "Keep" : "Remove"}
                    </Button>
                  </div>

                  {streamUrl && (
                    <div className="overflow-hidden rounded-md border border-default-200">
                      {isVideo ? (
                        <video controls className="max-h-56 w-full bg-black">
                          <source src={streamUrl} type={media.mimeType} />
                        </video>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={streamUrl}
                          alt={media.originalName}
                          className="max-h-56 w-full object-contain"
                        />
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {pendingUploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Pending Uploads</h4>
          {pendingUploads.map((upload) => (
            <Card key={upload.id}>
              <CardBody>
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{upload.file.name}</p>
                    <Chip size="sm" variant="flat">
                      {upload.file.type || "unknown"}
                    </Chip>
                    {upload.error && (
                      <p className="text-xs text-danger">{upload.error}</p>
                    )}
                  </div>

                  <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    onPress={() => onRemovePending(upload.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import { Drill } from "@/ui/features/drills/types";
import { getYouTubeEmbedUrl } from "@ams/domain/drills/video";

type DrillViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
  drill: Drill | null;
};

function formatDiscipline(value: Drill["discipline"]) {
  return value === "arm_care"
    ? "Arm Care"
    : `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function DrillViewModal({
  isOpen,
  onClose,
  isLoading,
  error,
  drill,
}: DrillViewModalProps) {
  const [selectedVideoFileId, setSelectedVideoFileId] = useState<string | null>(null);

  useEffect(() => {
    const firstVideo = drill?.media.find((media) => media.mimeType.startsWith("video/"));
    setSelectedVideoFileId(firstVideo?.fileId ?? null);
  }, [drill]);

  const selectedVideo = useMemo(() => {
    if (!drill) return null;
    const videos = drill.media.filter((media) => media.mimeType.startsWith("video/"));
    if (videos.length === 0) return null;
    if (!selectedVideoFileId) return videos[0];
    return videos.find((video) => video.fileId === selectedVideoFileId) ?? videos[0];
  }, [drill, selectedVideoFileId]);

  const youtubeEmbedUrl = getYouTubeEmbedUrl(drill?.videoId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Drill Details</ModalHeader>
        <ModalBody>
          {isLoading && <p className="text-sm text-foreground-500">Loading drill...</p>}

          {!isLoading && error && <p className="text-sm text-danger">{error}</p>}

          {!isLoading && !error && drill && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{drill.title}</h3>
                <p className="text-sm text-foreground-500">{drill.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Chip size="sm" color="secondary" variant="flat">
                  {formatDiscipline(drill.discipline)}
                </Chip>
                {drill.tags.map((tag) => (
                  <Chip key={`modal-${drill.id}-${tag}`} size="sm" variant="flat">
                    {tag}
                  </Chip>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Video Viewer</p>
                {drill.videoProvider === "youtube" && youtubeEmbedUrl ? (
                  <div className="aspect-video overflow-hidden rounded-md border border-default-200 bg-black">
                    <iframe
                      src={youtubeEmbedUrl}
                      title={`${drill.title} video`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null}

                {drill.videoProvider !== "youtube" &&
                  drill.media.filter((media) => media.mimeType.startsWith("video/")).length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {drill.media
                      .filter((media) => media.mimeType.startsWith("video/"))
                      .map((video) => (
                        <Button
                          key={video.fileId}
                          size="sm"
                          variant={selectedVideoFileId === video.fileId ? "solid" : "flat"}
                          onPress={() => setSelectedVideoFileId(video.fileId)}
                        >
                          {video.originalName}
                        </Button>
                      ))}
                  </div>
                )}

                {drill.videoProvider !== "youtube" && selectedVideo ? (
                  <video controls className="max-h-[60vh] w-full rounded-md bg-black">
                    <source
                      src={`/api/drills/${drill.id}/files/${selectedVideo.fileId}/stream`}
                      type={selectedVideo.mimeType}
                    />
                  </video>
                ) : null}

                {drill.videoProvider !== "youtube" && !selectedVideo ? (
                  <p className="text-sm text-foreground-500">
                    No video media is attached to this drill.
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

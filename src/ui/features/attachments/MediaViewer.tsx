"use client";

import { useEffect, useState } from "react";

import { Button } from "@heroui/react";

type MediaViewerProps = {
  streamUrl: string;
  downloadUrl: string;
  mimeType?: string | null;
  fileName?: string | null;
};

export function MediaViewer({
  streamUrl,
  downloadUrl,
  mimeType,
  fileName,
}: MediaViewerProps) {
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const lowerName = (fileName ?? "").toLowerCase();
  const isQuickTime =
    mimeType === "video/quicktime" || lowerName.endsWith(".mov");

  useEffect(() => {
    let cancelled = false;

    async function warmStream() {
      setIsChecking(true);
      try {
        const res = await fetch(streamUrl, {
          headers: { Range: "bytes=0-1" },
        });
        if (!res.ok && res.status !== 206) {
          throw new Error("Stream preflight failed");
        }
        if (!cancelled) {
          setError(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    warmStream();

    return () => {
      cancelled = true;
    };
  }, [streamUrl]);

  if (isChecking) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Preparing video stream...
      </div>
    );
  }

  if (isQuickTime) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
        <div>
          This video format isn’t supported by the browser preview.
        </div>
        <Button
          size="sm"
          variant="flat"
          onPress={() =>
            window.open(downloadUrl, "_blank", "noopener,noreferrer")
          }
        >
          Open Video
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
        <div>Video preview not available - download to view.</div>
        <Button
          size="sm"
          variant="flat"
          onPress={() =>
            window.open(downloadUrl, "_blank", "noopener,noreferrer")
          }
        >
          Open Video
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <video
        key={streamUrl}
        className="max-h-[65vh] w-full rounded-lg bg-black"
        controls
        preload="metadata"
        onError={() => setError(true)}
      >
        <source src={streamUrl} type={mimeType ?? undefined} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

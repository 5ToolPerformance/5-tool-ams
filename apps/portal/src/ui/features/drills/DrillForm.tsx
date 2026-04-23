"use client";

import { useMemo, useState } from "react";

import { Button, Card, CardBody, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DrillTagInput } from "@/ui/features/drills/DrillTagInput";
import { Drill, DrillDiscipline } from "@/ui/features/drills/types";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  parseYouTubeVideoUrl,
} from "@ams/domain/drills/video";

type DrillFormProps = {
  mode: "create" | "edit";
  initialDrill?: Drill;
  initialDiscipline?: DrillDiscipline;
  onSaved?: (drill: Drill) => void | Promise<void>;
  onCancel?: () => void;
  hideHeader?: boolean;
};

type SaveDrillResponse = {
  drill: Drill;
};

export function DrillForm({
  mode,
  initialDrill,
  initialDiscipline,
  onSaved,
  onCancel,
  hideHeader = false,
}: DrillFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialDrill?.title ?? "");
  const [description, setDescription] = useState(initialDrill?.description ?? "");
  const [discipline, setDiscipline] = useState<DrillDiscipline>(
    initialDrill?.discipline ?? initialDiscipline ?? "hitting"
  );
  const [tags, setTags] = useState<string[]>(initialDrill?.tags ?? []);
  const [videoUrl, setVideoUrl] = useState(initialDrill?.videoUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const parsedVideo = useMemo(() => {
    try {
      return parseYouTubeVideoUrl(videoUrl);
    } catch {
      return null;
    }
  }, [videoUrl]);

  const videoError = useMemo(() => {
    const normalized = videoUrl.trim();
    if (!normalized) return null;

    try {
      parseYouTubeVideoUrl(normalized);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Video URL must be a valid YouTube link";
    }
  }, [videoUrl]);

  const resolvedVideoId = useMemo(() => {
    const normalized = videoUrl.trim();
    if (normalized) {
      return parsedVideo?.videoId ?? null;
    }

    return initialDrill?.videoId ?? null;
  }, [initialDrill?.videoId, parsedVideo?.videoId, videoUrl]);

  const thumbnailUrl = getYouTubeThumbnailUrl(resolvedVideoId);
  const embedUrl = getYouTubeEmbedUrl(resolvedVideoId);

  async function saveDrillMeta(): Promise<Drill> {
    const endpoint = mode === "create" ? "/api/drills" : `/api/drills/${initialDrill?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        discipline,
        tags,
        videoUrl,
      }),
    });

    const data = (await res.json().catch(() => null)) as SaveDrillResponse | { error?: string } | null;

    if (!res.ok) {
      throw new Error(data && "error" in data ? data.error ?? "Failed to save drill" : "Failed to save drill");
    }

    if (!data || !("drill" in data)) {
      throw new Error("Invalid drill response");
    }

    return data.drill;
  }

  async function handleSubmit() {
    if (videoError) {
      toast.error(videoError);
      return;
    }

    setIsSaving(true);

    try {
      const drill = await saveDrillMeta();

      toast.success(mode === "create" ? "Drill created" : "Drill updated");
      if (onSaved) {
        await onSaved(drill);
      } else {
        router.push("/resources/drills");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save drill";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {hideHeader ? null : (
        <div>
          <h1 className="text-2xl font-semibold">
            {mode === "create" ? "Create Drill" : "Edit Drill"}
          </h1>
          <p className="text-sm text-foreground-500">
            Add drill details and a YouTube video reference for coaches in your facility.
          </p>
        </div>
      )}

      <Input
        label="Title"
        value={title}
        onValueChange={setTitle}
        isRequired
        maxLength={160}
      />

      <Textarea
        label="Description"
        value={description}
        onValueChange={setDescription}
        isRequired
        minRows={5}
      />

      <Select
        label="Discipline"
        selectedKeys={new Set([discipline])}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as DrillDiscipline | undefined;
          if (value) {
            setDiscipline(value);
          }
        }}
      >
        <SelectItem key="hitting">Hitting</SelectItem>
        <SelectItem key="pitching">Pitching</SelectItem>
        <SelectItem key="strength">Strength</SelectItem>
        <SelectItem key="fielding">Fielding</SelectItem>
        <SelectItem key="catching">Catching</SelectItem>
        <SelectItem key="arm_care">Arm Care</SelectItem>
      </Select>

      <DrillTagInput tags={tags} onChange={setTags} />

      <div className="space-y-4">
        <Input
          label="YouTube Video URL"
          placeholder="https://www.youtube.com/watch?v=..."
          value={videoUrl}
          onValueChange={setVideoUrl}
          isInvalid={!!videoError}
          errorMessage={videoError ?? undefined}
        />

        {thumbnailUrl ? (
          <Card className="border border-default-200">
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold">Video Preview</p>
                <div className="overflow-hidden rounded-md border border-default-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl}
                    alt="YouTube thumbnail preview"
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>

              {embedUrl ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">
                    {mode === "create" ? "Playback Preview" : "Current Video"}
                  </p>
                  <div className="aspect-video overflow-hidden rounded-md border border-default-200 bg-black">
                    <iframe
                      src={embedUrl}
                      title="YouTube drill preview"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : null}
            </CardBody>
          </Card>
        ) : null}

        {mode === "edit" && initialDrill?.media.length ? (
          <p className="text-xs text-foreground-500">
            Legacy uploaded drill media remains available in the drill viewer until it is migrated.
          </p>
        ) : null}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="flat" onPress={() => (onCancel ? onCancel() : router.push("/resources/drills"))}>
          Cancel
        </Button>
        <Button color="primary" onPress={handleSubmit} isLoading={isSaving}>
          {mode === "create" ? "Create Drill" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

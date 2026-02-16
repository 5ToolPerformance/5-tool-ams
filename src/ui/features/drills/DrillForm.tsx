"use client";

import { useState } from "react";

import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DrillMediaPicker, PendingUpload } from "@/ui/features/drills/DrillMediaPicker";
import { DrillTagInput } from "@/ui/features/drills/DrillTagInput";
import { Drill, DrillDiscipline } from "@/ui/features/drills/types";

type DrillFormProps = {
  mode: "create" | "edit";
  initialDrill?: Drill;
};

type SaveDrillResponse = {
  drill: Drill;
};

function toPendingUploads(files: FileList | null): PendingUpload[] {
  if (!files) return [];

  return Array.from(files).map((file) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    file,
  }));
}

export function DrillForm({ mode, initialDrill }: DrillFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialDrill?.title ?? "");
  const [description, setDescription] = useState(initialDrill?.description ?? "");
  const [discipline, setDiscipline] = useState<DrillDiscipline>(
    initialDrill?.discipline ?? "hitting"
  );
  const [tags, setTags] = useState<string[]>(initialDrill?.tags ?? []);
  const [existingMedia, setExistingMedia] = useState(initialDrill?.media ?? []);
  const [removeFileIds, setRemoveFileIds] = useState<string[]>([]);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  function toggleRemoveExisting(fileId: string) {
    setRemoveFileIds((current) =>
      current.includes(fileId)
        ? current.filter((id) => id !== fileId)
        : [...current, fileId]
    );
  }

  function addPendingFiles(files: FileList | null) {
    setPendingUploads((current) => [...current, ...toPendingUploads(files)]);
  }

  function removePending(id: string) {
    setPendingUploads((current) => current.filter((item) => item.id !== id));
  }

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

  async function deleteMarkedFiles(drillId: string) {
    if (removeFileIds.length === 0) return;

    const results = await Promise.allSettled(
      removeFileIds.map(async (fileId) => {
        const res = await fetch(`/api/drills/${drillId}/files/${fileId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "Failed to remove media");
        }
      })
    );

    const failed = results.filter((result) => result.status === "rejected");
    if (failed.length > 0) {
      throw new Error(`${failed.length} media item(s) failed to remove`);
    }

    setExistingMedia((current) =>
      current.filter((media) => !removeFileIds.includes(media.fileId))
    );
    setRemoveFileIds([]);
  }

  async function uploadPendingFiles(drillId: string) {
    if (pendingUploads.length === 0) return;

    const results = await Promise.allSettled(
      pendingUploads.map(async (pending) => {
        const formData = new FormData();
        formData.append("file", pending.file);

        const res = await fetch(`/api/drills/${drillId}/files`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "Upload failed");
        }

        return (await res.json()) as { media: Drill["media"][number] };
      })
    );

    const createdMedia: Drill["media"] = [];
    const erroredByUploadId = new Map<string, string>();

    results.forEach((result, index) => {
      const pending = pendingUploads[index];
      if (result.status === "fulfilled") {
        createdMedia.push(result.value.media);
      } else {
        const errorText =
          result.reason instanceof Error ? result.reason.message : "Upload failed";
        erroredByUploadId.set(pending.id, errorText);
      }
    });

    if (createdMedia.length > 0) {
      setExistingMedia((current) => [...current, ...createdMedia]);
    }

    if (erroredByUploadId.size === 0) {
      setPendingUploads([]);
      return;
    }

    setPendingUploads((current) => {
      const next: PendingUpload[] = [];
      for (const upload of current) {
        const error = erroredByUploadId.get(upload.id);
        if (error) {
          next.push({
            ...upload,
            error,
          });
        }
      }
      return next;
    });

    throw new Error(`${erroredByUploadId.size} media file(s) failed to upload`);
  }

  async function handleSubmit() {
    setIsSaving(true);

    try {
      const savedDrill = await saveDrillMeta();
      await deleteMarkedFiles(savedDrill.id);
      await uploadPendingFiles(savedDrill.id);

      toast.success(mode === "create" ? "Drill created" : "Drill updated");
      router.push("/drills");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save drill";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {mode === "create" ? "Create Drill" : "Edit Drill"}
        </h1>
        <p className="text-sm text-foreground-500">
          Add drill details and media for coaches in your facility.
        </p>
      </div>

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

      <DrillMediaPicker
        drillId={initialDrill?.id}
        existingMedia={existingMedia}
        removeFileIds={removeFileIds}
        onToggleRemoveExisting={toggleRemoveExisting}
        pendingUploads={pendingUploads}
        onAddFiles={addPendingFiles}
        onRemovePending={removePending}
      />

      <div className="flex justify-end gap-2">
        <Button variant="flat" onPress={() => router.push("/drills")}>
          Cancel
        </Button>
        <Button color="primary" onPress={handleSubmit} isLoading={isSaving}>
          {mode === "create" ? "Create Drill" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

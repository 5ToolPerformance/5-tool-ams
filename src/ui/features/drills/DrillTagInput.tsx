"use client";

import { useState } from "react";

import { Button, Chip, Input } from "@heroui/react";

type DrillTagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export function DrillTagInput({ tags, onChange }: DrillTagInputProps) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const normalized = draft.trim().toLowerCase();
    if (!normalized) return;
    if (tags.includes(normalized)) {
      setDraft("");
      return;
    }
    onChange([...tags, normalized]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((item) => item !== tag));
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          label="Tags"
          placeholder="Add a tag and press Add"
          value={draft}
          onValueChange={setDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
        />
        <Button className="self-end" variant="flat" onPress={addTag}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip key={tag} onClose={() => removeTag(tag)} variant="flat">
            {tag}
          </Chip>
        ))}
      </div>
    </div>
  );
}

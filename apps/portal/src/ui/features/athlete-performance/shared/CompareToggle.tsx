"use client";

import { Button } from "@heroui/react";

interface CompareToggleProps {
  label?: string;
  disabledLabel?: string;
}

export function CompareToggle({
  label = "Compare",
  disabledLabel = "Compare (soon)",
}: CompareToggleProps) {
  return (
    <Button variant="flat" size="sm" isDisabled>
      {disabledLabel || label}
    </Button>
  );
}

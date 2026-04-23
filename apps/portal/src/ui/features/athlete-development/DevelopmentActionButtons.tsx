"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

type DevelopmentAction = "evaluation" | "plan" | "routine" | "export";

const ACTION_LABELS: Record<DevelopmentAction, string> = {
  evaluation: "New Evaluation",
  plan: "New Development Plan",
  routine: "New Routine",
  export: "Export",
};

interface DevelopmentActionButtonsProps {
  primaryAction?: DevelopmentAction;
  canCreatePlan: boolean;
  canCreateRoutine: boolean;
  canExportPdf?: boolean;
  canCopyRawJson?: boolean;
  onOpenEvaluation: () => void;
  onOpenPlan: () => void;
  onOpenRoutine: () => void;
  onExportPdf?: () => void;
  onCopyRawJson?: () => void;
}

export function DevelopmentActionButtons({
  primaryAction = "evaluation",
  canCreatePlan,
  canCreateRoutine,
  canExportPdf = false,
  canCopyRawJson = false,
  onOpenEvaluation,
  onOpenPlan,
  onOpenRoutine,
  onExportPdf,
  onCopyRawJson,
}: DevelopmentActionButtonsProps) {
  const canExport = canExportPdf || canCopyRawJson;

  return (
    <div
      aria-label="Development tab actions"
      className="flex flex-wrap gap-2"
      role="group"
    >
      <Button
        size="sm"
        color={primaryAction === "evaluation" ? "primary" : "default"}
        disableRipple
        variant={primaryAction === "evaluation" ? "solid" : "flat"}
        onPress={onOpenEvaluation}
      >
        {ACTION_LABELS.evaluation}
      </Button>
      <Button
        size="sm"
        color={primaryAction === "plan" ? "primary" : "default"}
        disableRipple
        variant={primaryAction === "plan" ? "solid" : "flat"}
        onPress={onOpenPlan}
        isDisabled={!canCreatePlan}
      >
        {ACTION_LABELS.plan}
      </Button>
      <Button
        size="sm"
        color={primaryAction === "routine" ? "primary" : "default"}
        disableRipple
        variant={primaryAction === "routine" ? "solid" : "flat"}
        onPress={onOpenRoutine}
        isDisabled={!canCreateRoutine}
      >
        {ACTION_LABELS.routine}
      </Button>
      {canExport ? (
        <Dropdown>
          <DropdownTrigger>
            <Button
              size="sm"
              color={primaryAction === "export" ? "primary" : "default"}
              disableRipple
              variant={primaryAction === "export" ? "solid" : "flat"}
            >
              {ACTION_LABELS.export}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Export options">
            <DropdownItem
              key="pdf"
              isDisabled={!canExportPdf}
              onPress={onExportPdf}
            >
              Generate PDF
            </DropdownItem>
            <DropdownItem
              key="raw-json"
              isDisabled={!canCopyRawJson}
              onPress={onCopyRawJson}
            >
              Copy Raw JSON
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : null}
    </div>
  );
}

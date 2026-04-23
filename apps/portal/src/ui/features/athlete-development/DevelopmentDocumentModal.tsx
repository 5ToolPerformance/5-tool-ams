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
  Spinner,
} from "@heroui/react";
import { toast } from "sonner";

import type {
  DevelopmentPlanDetailData,
  EvaluationDetailData,
} from "@ams/application/players/development/getDevelopmentDocumentDetails";
import { resolveStrengthEvidencePowerRating } from "@ams/domain/evaluations/strengthEvidence";
import { copyTextToClipboard } from "@/utils/clipboard";
import FormattedText from "@/ui/core/primitives/formattedText";
import { useAttachmentViewer } from "@/ui/features/attachments/AttachmentViewerProvider";

import { formatDate } from "./utils";

type DevelopmentDocumentType = "evaluation" | "development-plan";

type DevelopmentDocumentModalProps = {
  isOpen: boolean;
  documentId: string | null;
  documentType: DevelopmentDocumentType | null;
  onClose: () => void;
  onEditDocument?: (
    documentId: string,
    documentType: DevelopmentDocumentType
  ) => void;
};

type DocumentDetailResponse = EvaluationDetailData | DevelopmentPlanDetailData;

function startCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderMetricValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date) {
    return formatDate(value);
  }

  return String(value);
}

function getEvidenceMetrics(
  evidence: EvaluationDetailData["evidenceForms"][number]
): Array<[string, unknown]> {
  const metrics = Object.entries(evidence).filter(
    ([key, value]) =>
      ![
        "type",
        "evidenceId",
        "notes",
        "performanceSessionId",
        "recordedAt",
      ].includes(key) && renderMetricValue(value)
  );

  if (evidence.type !== "strength") {
    return metrics;
  }

  const filteredMetrics = metrics.filter(([key]) => key !== "powerRating");
  const resolvedPowerRating = resolveStrengthEvidencePowerRating(evidence);

  if (resolvedPowerRating) {
    filteredMetrics.unshift(["powerRating", resolvedPowerRating]);
  }

  return filteredMetrics;
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function SummaryField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="space-y-1 rounded-lg border border-default-200 bg-default-50/40 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="text-sm text-foreground">
        <FormattedText text={value} />
      </div>
    </div>
  );
}

function TextList({
  items,
  emptyLabel,
}: {
  items: string[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip key={item} size="sm" variant="bordered">
          {item}
        </Chip>
      ))}
    </div>
  );
}

function DescriptionList({
  items,
  emptyLabel,
}: {
  items: Array<{ title: string; description: string | null }>;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-lg border border-default-200 p-3"
        >
          <p className="text-sm font-semibold">{item.title}</p>
          {item.description ? (
            <div className="mt-2 text-sm text-muted-foreground">
              <FormattedText text={item.description} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function AttachmentList({
  attachments,
}: {
  attachments: EvaluationDetailData["attachments"];
}) {
  const { openAttachment } = useAttachmentViewer();

  if (attachments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No attachments linked.</p>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-default-200 p-3"
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              {attachment.file?.originalFileName ?? attachment.source}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Chip size="sm" variant="flat">
                {attachment.type}
              </Chip>
              <span>{attachment.source}</span>
              <span>{formatDate(attachment.createdAt)}</span>
            </div>
            {attachment.notes ? (
              <div className="text-sm text-muted-foreground">
                <FormattedText text={attachment.notes} />
              </div>
            ) : null}
          </div>
          <Button
            size="sm"
            variant="flat"
            onPress={() => openAttachment(attachment)}
          >
            View Attachment
          </Button>
        </div>
      ))}
    </div>
  );
}

function EvidenceFormsList({
  evidenceForms,
}: {
  evidenceForms: EvaluationDetailData["evidenceForms"];
}) {
  if (evidenceForms.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No structured evidence metrics linked.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {evidenceForms.map((evidence, index) => {
        const metrics = getEvidenceMetrics(evidence);

        return (
          <div
            key={evidence.evidenceId ?? `${evidence.type}-${index}`}
            className="space-y-3 rounded-lg border border-default-200 p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Chip size="sm" color="primary" variant="flat">
                {startCase(evidence.type)}
              </Chip>
              {evidence.recordedAt ? (
                <Chip size="sm" variant="flat">
                  {formatDate(evidence.recordedAt)}
                </Chip>
              ) : null}
              {evidence.performanceSessionId ? (
                <Chip size="sm" variant="bordered">
                  Session {evidence.performanceSessionId}
                </Chip>
              ) : null}
            </div>
            {metrics.length > 0 ? (
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                {metrics.map(([key, value]) => (
                  <div key={key} className="rounded-md bg-default-50/50 p-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {startCase(key)}
                    </dt>
                    <dd className="mt-1 text-foreground">
                      {renderMetricValue(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {evidence.notes ? (
              <div className="text-sm text-muted-foreground">
                <FormattedText text={evidence.notes} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function EvaluationDetailView({ data }: { data: EvaluationDetailData }) {
  return (
    <div className="space-y-6">
      <DetailSection title="Evaluation Summary">
        <div className="flex flex-wrap gap-2">
          <Chip size="sm" variant="flat">
            {data.evaluationType}
          </Chip>
          <Chip size="sm" variant="flat">
            {data.phase}
          </Chip>
          <Chip size="sm" variant="flat">
            {formatDate(data.evaluationDate)}
          </Chip>
          <Chip size="sm" color="secondary" variant="flat">
            {data.details.evidence.length + data.attachments.length} evidence
            item
            {data.details.evidence.length + data.attachments.length === 1
              ? ""
              : "s"}
          </Chip>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <SummaryField label="Snapshot" value={data.snapshotSummary} />
          <SummaryField
            label="Strength Profile"
            value={data.strengthProfileSummary}
          />
          <SummaryField
            label="Constraints"
            value={data.keyConstraintsSummary}
          />
        </div>
      </DetailSection>

      <DetailSection title="Focus Areas">
        <DescriptionList
          items={data.details.focusAreas}
          emptyLabel="No focus areas recorded."
        />
      </DetailSection>

      <DetailSection title="Strengths">
        <TextList
          items={data.details.strengths}
          emptyLabel="No strengths recorded."
        />
      </DetailSection>

      <DetailSection title="Constraint Details">
        <TextList
          items={data.details.constraints}
          emptyLabel="No additional constraints recorded."
        />
      </DetailSection>

      <DetailSection title="Structured Evidence">
        <EvidenceFormsList evidenceForms={data.evidenceForms} />
      </DetailSection>

      <DetailSection title="Attachments">
        <AttachmentList attachments={data.attachments} />
      </DetailSection>
    </div>
  );
}

function DevelopmentPlanDetailView({
  data,
}: {
  data: DevelopmentPlanDetailData;
}) {
  return (
    <div className="space-y-6">
      <DetailSection title="Development Plan Summary">
        <div className="flex flex-wrap gap-2">
          <Chip size="sm" color="success" variant="flat">
            {data.status}
          </Chip>
          <Chip size="sm" variant="flat">
            Start {formatDate(data.startDate)}
          </Chip>
          <Chip size="sm" variant="flat">
            Target End {formatDate(data.targetEndDate)}
          </Chip>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <SummaryField label="Summary" value={data.details.summary} />
          <SummaryField
            label="Current Priority"
            value={data.details.currentPriority}
          />
        </div>
      </DetailSection>

      <DetailSection title="Short-Term Goals">
        <DescriptionList
          items={data.details.shortTermGoals}
          emptyLabel="No short-term goals recorded."
        />
      </DetailSection>

      <DetailSection title="Long-Term Goals">
        <DescriptionList
          items={data.details.longTermGoals}
          emptyLabel="No long-term goals recorded."
        />
      </DetailSection>

      <DetailSection title="Focus Areas">
        <DescriptionList
          items={data.details.focusAreas}
          emptyLabel="No focus areas recorded."
        />
      </DetailSection>

      <DetailSection title="Measurable Indicators">
        {data.details.measurableIndicators.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No measurable indicators recorded.
          </p>
        ) : (
          <div className="space-y-3">
            {data.details.measurableIndicators.map((indicator) => (
              <div
                key={indicator.title}
                className="rounded-lg border border-default-200 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{indicator.title}</p>
                  {indicator.metricType ? (
                    <Chip size="sm" variant="flat">
                      {indicator.metricType}
                    </Chip>
                  ) : null}
                </div>
                {indicator.description ? (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <FormattedText text={indicator.description} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </DetailSection>

      <DetailSection title="Source Evaluation Evidence">
        {data.linkedEvaluation ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Chip size="sm" variant="flat">
                {data.linkedEvaluation.evaluationType}
              </Chip>
              <Chip size="sm" variant="flat">
                {data.linkedEvaluation.phase}
              </Chip>
              <Chip size="sm" variant="flat">
                {formatDate(data.linkedEvaluation.evaluationDate)}
              </Chip>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              <SummaryField
                label="Snapshot"
                value={data.linkedEvaluation.snapshotSummary}
              />
              <SummaryField
                label="Strength Profile"
                value={data.linkedEvaluation.strengthProfileSummary}
              />
              <SummaryField
                label="Constraints"
                value={data.linkedEvaluation.keyConstraintsSummary}
              />
            </div>
            <EvidenceFormsList
              evidenceForms={data.linkedEvaluation.evidenceForms}
            />
            <AttachmentList attachments={data.linkedEvaluation.attachments} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            The linked evaluation could not be loaded.
          </p>
        )}
      </DetailSection>
    </div>
  );
}

export function DevelopmentDocumentModal({
  isOpen,
  documentId,
  documentType,
  onClose,
  onEditDocument,
}: DevelopmentDocumentModalProps) {
  const [data, setData] = useState<DocumentDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !documentId || !documentType) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const endpoint =
      documentType === "evaluation"
        ? `/api/evaluations/${documentId}`
        : `/api/development-plans/${documentId}`;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(payload?.error ?? "Unable to load document.");
        }

        const payload = (await response.json()) as DocumentDetailResponse;
        if (!cancelled) {
          setData(payload);
        }
      } catch (fetchError) {
        if (!cancelled) {
          console.error(fetchError);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load document."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [documentId, documentType, isOpen]);

  const title = useMemo(() => {
    if (documentType === "evaluation") {
      return "Evaluation";
    }

    if (documentType === "development-plan") {
      return "Development Plan";
    }

    return "Document";
  }, [documentType]);

  async function handleCopyJson() {
    if (!data) {
      return;
    }

    try {
      const payload =
        data.copyPayload && typeof data.copyPayload === "object"
          ? data.copyPayload
          : data;

      await copyTextToClipboard(JSON.stringify(payload, null, 2));
      toast.success(`${title} JSON copied.`);
    } catch (error) {
      console.error(error);
      toast.error(`Unable to copy ${title.toLowerCase()} JSON.`);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center" size="5xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{title} Details</h2>
                  <p className="text-sm text-muted-foreground">
                    Full formatted content, evidence, and attachments.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      documentId && documentType
                        ? onEditDocument?.(documentId, documentType)
                        : undefined
                    }
                    isDisabled={!documentId || !documentType}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={handleCopyJson}
                    isDisabled={!data}
                  >
                    Copy JSON
                  </Button>
                  <Button size="sm" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                </div>
              </div>
              <Divider />
            </ModalHeader>
            <ModalBody className="max-h-[70vh] overflow-y-auto pb-6">
              {isLoading ? (
                <div className="flex min-h-[240px] items-center justify-center">
                  <Spinner label="Loading document" />
                </div>
              ) : error ? (
                <div className="rounded-lg border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">
                  {error}
                </div>
              ) : documentType === "evaluation" && data ? (
                <EvaluationDetailView data={data as EvaluationDetailData} />
              ) : documentType === "development-plan" && data ? (
                <DevelopmentPlanDetailView
                  data={data as DevelopmentPlanDetailData}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No document selected.
                </p>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

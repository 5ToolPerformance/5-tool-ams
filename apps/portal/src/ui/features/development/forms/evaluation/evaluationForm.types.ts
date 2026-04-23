import { EvaluationDocumentV1 } from "@ams/domain/evaluations/types";
import type {
  EvaluationEvidenceType,
  EvaluationEvidenceWriteInput,
} from "@ams/domain/evaluations/evidence";
import type { AttachmentViewerAttachment } from "@/ui/features/attachments/types";

export type EvaluationType =
  | "baseline"
  | "monthly"
  | "season_review"
  | "injury_return"
  | "general"
  | "tests_only";

export type AthletePhase =
  | "offseason"
  | "preseason"
  | "inseason"
  | "postseason"
  | "rehab"
  | "return_to_play"
  | "general";

export type EvaluationBucketStatus =
  | "strength"
  | "developing"
  | "constraint"
  | "not_relevant";

export type EvaluationSubmitAction = "save" | "save-and-plan";
export type EvaluationFormMode = "create" | "edit";

export type EvaluationFormFocusArea = {
  id: string;
  title: string;
  description: string;
};

export type EvaluationFormBucket = {
  id: string;
  bucketId: string;
  status: EvaluationBucketStatus | "";
  notes: string;
};

export type EvaluationFormEvidence = EvaluationEvidenceWriteInput & {
  id: string;
  recordedAt: string;
  notes: string;
  performanceSessionId?: string;
  evidenceId?: string;
};

export type EvaluationMediaAttachment = {
  id: string;
  status: "pending" | "uploaded";
  type: "file_image" | "file_video";
  fileName: string;
  mimeType: string;
  createdAt?: string;
  attachmentId?: string;
  file?: File;
};

export type EvaluationDisciplineOption = {
  id: string;
  key: string;
  label: string;
};

export type EvaluationBucketOption = {
  id: string;
  disciplineId: string;
  key: string;
  label: string;
  description: string | null;
  sortOrder: number | null;
  active: boolean;
};

export type EvaluationFormValues = {
  disciplineId: string;
  evaluationDate: string;
  evaluationType: EvaluationType;
  phase: AthletePhase;
  injuryConsiderations: string;

  snapshotSummary: string;
  strengthProfileSummary: string;
  keyConstraintsSummary: string;

  snapshotNotes: string;

  strengths: string[];
  strengthProfileNotes: string;

  constraints: string[];
  constraintsNotes: string;

  focusAreas: EvaluationFormFocusArea[];
  buckets: EvaluationFormBucket[];
  evidence: EvaluationFormEvidence[];
  mediaAttachments: EvaluationMediaAttachment[];
};

export type EvaluationFormErrorMap = Partial<Record<string, string>>;

export type EvaluationFormRecord = {
  id: string;
  playerId: string;
  disciplineId: string;
  createdBy: string;
  evaluationDate: Date | string;
  evaluationType: EvaluationType;
  phase: AthletePhase;
  injuryConsiderations: string | null;
  snapshotSummary: string;
  strengthProfileSummary: string;
  keyConstraintsSummary: string;
  documentData: EvaluationDocumentV1 | null;
  evidenceForms?: EvaluationFormEvidence[];
  mediaAttachments?: AttachmentViewerAttachment[];
};

export type EvaluationCreateContext = {
  playerId: string;
  disciplineId: string;
  createdBy: string;
};

export type EvaluationFormSubmitPayload = {
  playerId: string;
  disciplineId: string;
  createdBy: string;
  evaluationDate: Date;
  evaluationType: EvaluationType;
  phase: AthletePhase;
  injuryConsiderations?: string | null;
  snapshotSummary: string;
  strengthProfileSummary: string;
  keyConstraintsSummary: string;
  documentData: EvaluationDocumentV1;
  evidenceForms: EvaluationEvidenceWriteInput[];
};

export type EvaluationFormContextValue = {
  mode: EvaluationFormMode;
  disciplineOptions: EvaluationDisciplineOption[];
  selectedDiscipline: EvaluationDisciplineOption | null;
  bucketOptions: EvaluationBucketOption[];
  availableBucketOptions: EvaluationBucketOption[];
  values: EvaluationFormValues;
  errors: EvaluationFormErrorMap;
  isSubmitting: boolean;
  submitAction: EvaluationSubmitAction | null;

  setFieldValue: <K extends keyof EvaluationFormValues>(
    key: K,
    value: EvaluationFormValues[K]
  ) => void;

  addStrength: () => void;
  updateStrength: (index: number, value: string) => void;
  removeStrength: (index: number) => void;

  addConstraint: () => void;
  updateConstraint: (index: number, value: string) => void;
  removeConstraint: (index: number) => void;

  addFocusArea: () => void;
  updateFocusArea: (
    index: number,
    value: Partial<EvaluationFormFocusArea>
  ) => void;
  removeFocusArea: (index: number) => void;

  addBucket: () => void;
  updateBucket: (index: number, value: Partial<EvaluationFormBucket>) => void;
  removeBucket: (index: number) => void;

  addEvidence: (type: EvaluationEvidenceType) => void;
  updateEvidence: (
    index: number,
    value: Partial<EvaluationFormEvidence>
  ) => void;
  removeEvidence: (index: number) => void;

  addMediaAttachments: (files: File[]) => void;
  removeMediaAttachment: (index: number) => void;

  handleSubmit: (action: EvaluationSubmitAction) => Promise<void>;
  resetForm: () => void;
};

export type EvaluationFormProviderProps = {
  mode: EvaluationFormMode;
  playerId?: string;
  createdBy: string;
  disciplineOptions: EvaluationDisciplineOption[];
  bucketOptions: EvaluationBucketOption[];
  initialEvaluation?: EvaluationFormRecord | null;
  onCancel?: () => void;
  onSaved?: (evaluationId: string) => void;
  onSavedAndContinue?: (evaluationId: string) => void;
  children: React.ReactNode;
};

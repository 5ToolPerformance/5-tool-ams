import { DevelopmentPlanDocumentV1 } from "@/domain/development-plans/types";

export type DevelopmentPlanStatus =
  | "draft"
  | "active"
  | "completed"
  | "archived";

export type DevelopmentPlanSubmitAction = "save" | "save-and-routine";
export type DevelopmentPlanFormMode = "create" | "edit";

export type DevelopmentPlanEvaluationOption = {
  id: string;
  disciplineId: string;
  disciplineLabel: string;
  evaluationDate: Date | string;
  evaluationType: string;
  phase: string;
  summary: string;
};

export type DevelopmentPlanFormListItem = {
  id: string;
  title: string;
  description: string;
};

export type DevelopmentPlanFormMeasurableIndicator = {
  id: string;
  title: string;
  description: string;
  metricType: string;
};

export type DevelopmentPlanFormValues = {
  evaluationId: string;
  status: DevelopmentPlanStatus;
  startDate: string;
  targetEndDate: string;
  summary: string;
  currentPriority: string;
  shortTermGoals: DevelopmentPlanFormListItem[];
  longTermGoals: DevelopmentPlanFormListItem[];
  focusAreas: DevelopmentPlanFormListItem[];
  measurableIndicators: DevelopmentPlanFormMeasurableIndicator[];
};

export type DevelopmentPlanFormErrorMap = Partial<Record<string, string>>;

export type DevelopmentPlanFormRecord = {
  id: string;
  playerId: string;
  disciplineId: string;
  evaluationId: string;
  createdBy: string;
  status: DevelopmentPlanStatus;
  startDate: Date | string | null;
  targetEndDate: Date | string | null;
  documentData: DevelopmentPlanDocumentV1 | null;
};

export type DevelopmentPlanCreateContext = {
  playerId: string;
  createdBy: string;
  evaluation: Pick<
    DevelopmentPlanEvaluationOption,
    "id" | "disciplineId" | "disciplineLabel"
  >;
};

export type DevelopmentPlanFormSubmitPayload = {
  playerId: string;
  disciplineId: string;
  evaluationId: string;
  createdBy: string;
  status: DevelopmentPlanStatus;
  startDate?: Date | null;
  targetEndDate?: Date | null;
  documentData: DevelopmentPlanDocumentV1;
};

export type DevelopmentPlanFormContextValue = {
  mode: DevelopmentPlanFormMode;
  evaluationOptions: DevelopmentPlanEvaluationOption[];
  selectedEvaluation: DevelopmentPlanEvaluationOption | null;
  isEvaluationSelectionLocked: boolean;
  values: DevelopmentPlanFormValues;
  errors: DevelopmentPlanFormErrorMap;
  isSubmitting: boolean;
  submitAction: DevelopmentPlanSubmitAction | null;
  setFieldValue: <K extends keyof DevelopmentPlanFormValues>(
    key: K,
    value: DevelopmentPlanFormValues[K]
  ) => void;
  addShortTermGoal: () => void;
  updateShortTermGoal: (
    index: number,
    value: Partial<DevelopmentPlanFormListItem>
  ) => void;
  removeShortTermGoal: (index: number) => void;
  addLongTermGoal: () => void;
  updateLongTermGoal: (
    index: number,
    value: Partial<DevelopmentPlanFormListItem>
  ) => void;
  removeLongTermGoal: (index: number) => void;
  addFocusArea: () => void;
  updateFocusArea: (
    index: number,
    value: Partial<DevelopmentPlanFormListItem>
  ) => void;
  removeFocusArea: (index: number) => void;
  addMeasurableIndicator: () => void;
  updateMeasurableIndicator: (
    index: number,
    value: Partial<DevelopmentPlanFormMeasurableIndicator>
  ) => void;
  removeMeasurableIndicator: (index: number) => void;
  handleSubmit: (action: DevelopmentPlanSubmitAction) => Promise<void>;
  resetForm: () => void;
};

export type DevelopmentPlanFormProviderProps = {
  mode: DevelopmentPlanFormMode;
  playerId?: string;
  createdBy: string;
  evaluationOptions?: DevelopmentPlanEvaluationOption[];
  initialEvaluationId?: string;
  isEvaluationSelectionLocked?: boolean;
  initialDevelopmentPlan?: DevelopmentPlanFormRecord | null;
  onCancel?: () => void;
  onSaved?: (developmentPlanId: string) => void;
  onSavedAndContinue?: (developmentPlanId: string) => void;
  children: React.ReactNode;
};

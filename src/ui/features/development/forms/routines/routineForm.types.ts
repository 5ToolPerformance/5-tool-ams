import { RoutineDocumentV1 } from "@/domain/routines/types";

import type {
  RoutineDevelopmentPlanOption,
  RoutineDisciplineOption,
  RoutineDrillOption,
  RoutineMechanicOption,
} from "@/application/routines/getRoutineFormConfig";

export type RoutineType = "partial_lesson" | "full_lesson" | "progression";
export type RoutineFormMode = "create" | "edit";
export type RoutineSubmitAction = "save";
export type RoutineFormContextType = "development-plan" | "universal";

export type RoutineFormMechanic = {
  id: string;
  mechanicId: string;
  title: string;
};

export type RoutineFormDrill = {
  id: string;
  drillId: string;
  title: string;
  notes: string;
  sortOrder: number;
};

export type RoutineFormBlock = {
  id: string;
  title: string;
  notes: string;
  sortOrder: number;
  drills: RoutineFormDrill[];
};

export type RoutineFormValues = {
  developmentPlanId: string;
  disciplineId: string;
  title: string;
  description: string;
  routineType: RoutineType;
  sortOrder: number;
  isActive: boolean;
  summary: string;
  usageNotes: string;
  mechanics: RoutineFormMechanic[];
  blocks: RoutineFormBlock[];
};

export type RoutineFormErrorMap = Partial<Record<string, string>>;

export type RoutineFormRecord = {
  id: string;
  contextType: RoutineFormContextType;
  developmentPlanId?: string;
  playerId?: string | null;
  disciplineId: string;
  disciplineKey: string;
  disciplineLabel: string;
  createdBy: string;
  title: string;
  description: string | null;
  routineType: RoutineType;
  sortOrder: number;
  isActive: boolean;
  documentData: RoutineDocumentV1 | null;
};

export type RoutineCreateContext =
  | {
      contextType: "development-plan";
      developmentPlan: RoutineDevelopmentPlanOption;
      createdBy: string;
    }
  | {
      contextType: "universal";
      discipline: RoutineDisciplineOption;
      createdBy: string;
    };

export type RoutineFormSubmitPayload = {
  developmentPlanId?: string;
  disciplineId?: string;
  createdBy: string;
  title: string;
  description?: string | null;
  routineType: RoutineType;
  sortOrder?: number;
  isActive?: boolean;
  documentData: RoutineDocumentV1;
};

export type RoutineFormContextValue = {
  mode: RoutineFormMode;
  contextType: RoutineFormContextType;
  developmentPlanOptions: RoutineDevelopmentPlanOption[];
  disciplineOptions: RoutineDisciplineOption[];
  selectedDevelopmentPlan: RoutineDevelopmentPlanOption | null;
  selectedDiscipline: RoutineDisciplineOption | null;
  isDevelopmentPlanSelectionLocked: boolean;
  mechanicOptions: RoutineMechanicOption[];
  drillOptions: RoutineDrillOption[];
  availableMechanicOptions: RoutineMechanicOption[];
  availableDrillOptions: RoutineDrillOption[];
  values: RoutineFormValues;
  errors: RoutineFormErrorMap;
  isSubmitting: boolean;
  submitAction: RoutineSubmitAction | null;
  setFieldValue: <K extends keyof RoutineFormValues>(
    key: K,
    value: RoutineFormValues[K]
  ) => void;
  addMechanic: () => void;
  updateMechanic: (index: number, value: Partial<RoutineFormMechanic>) => void;
  removeMechanic: (index: number) => void;
  addBlock: () => void;
  updateBlock: (
    index: number,
    value: Partial<Omit<RoutineFormBlock, "drills">>
  ) => void;
  removeBlock: (index: number) => void;
  addDrillToBlock: (blockIndex: number) => void;
  updateDrillInBlock: (
    blockIndex: number,
    drillIndex: number,
    value: Partial<RoutineFormDrill>
  ) => void;
  removeDrillFromBlock: (blockIndex: number, drillIndex: number) => void;
  handleSubmit: (action: RoutineSubmitAction) => Promise<void>;
  resetForm: () => void;
};

export type RoutineFormProviderProps = {
  mode: RoutineFormMode;
  contextType?: RoutineFormContextType;
  createdBy: string;
  developmentPlanOptions?: RoutineDevelopmentPlanOption[];
  disciplineOptions?: RoutineDisciplineOption[];
  mechanicOptions?: RoutineMechanicOption[];
  drillOptions?: RoutineDrillOption[];
  initialDevelopmentPlanId?: string;
  initialDisciplineId?: string;
  isDevelopmentPlanSelectionLocked?: boolean;
  initialRoutine?: RoutineFormRecord | null;
  onCancel?: () => void;
  onSaved?: (routineId: string) => void;
  children: React.ReactNode;
};

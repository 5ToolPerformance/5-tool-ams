export interface ArmCare {
  id: string;
  userId: string;
  coachId: string;
  notes: string;
  shoulder_er_l: number;
  shoulder_er_r: number;
  shoulder_ir_l: number;
  shoulder_ir_r: number;
  shoulder_flexion_l: number;
  shoulder_flexion_r: number;
  supine_hip_er_l: number;
  supine_hip_er_r: number;
  supine_hip_ir_l: number;
  supine_hip_ir_r: number;
  straight_leg_l: number;
  straight_leg_r: number;
  lessonDate: Date;
  createdOn: Date;
}

export type NewArmCare = Omit<ArmCare, "id" | "createdOn">;

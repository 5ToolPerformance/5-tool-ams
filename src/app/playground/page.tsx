import { generateTanStackForm, parseInterface } from "@/utils/form-generator";

const smfaInterface = `export interface SMFAForm {
  notes?: string;
  pelvic_rotation_l?: number;
  pelvic_rotation_r?: number;
  seated_trunk_rotation_l?: number;
  seated_trunk_rotation_r?: number;
  ankle_test_l?: number;
  ankle_test_r?: number;
  forearm_test_l?: number;
  forearm_test_r?: number;
  cervical_rotation_l?: number;
  cervical_rotation_r?: number;
  msf_l?: number;
  msf_r?: number;
  mse_l?: number;
  mse_r?: number;
  msr_l?: number;
  msr_r?: number;
  pelvic_tilt?: number;
  squat_test?: number;
  cervical_flexion?: number;
  cervical_extension?: number;
}`;

export default async function PlaygroundPage() {
  const fields = parseInterface(smfaInterface);
  const generatedForm = generateTanStackForm("SMFA", fields);

  console.log(generatedForm);
}

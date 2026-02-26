import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionItem,
  Input,
  Radio,
  RadioGroup,
  Slider,
} from "@heroui/react";

import { FatigueReportData } from "@/hooks/lessons/lessonForm.types";
import { useLessonFormContext } from "@/ui/features/lesson-form/LessonFormProvider";

type FatigueCheckinProps = {
  playerId: string;
};

export function FatigueCheckin({ playerId }: FatigueCheckinProps) {
  const { form } = useLessonFormContext();
  const formFatigueReport = form.state.values.players[playerId]?.fatigueReport;
  const [severity, setSeverity] = useState(0);
  const [fatigue, setFatigue] = useState<FatigueReportData["report"]>("none");
  const [bodyPartId, setBodyPartId] = useState<string>("");

  useEffect(() => {
    setFatigue(formFatigueReport?.report ?? "none");
    setBodyPartId(formFatigueReport?.bodyPartId ?? "");
    setSeverity(formFatigueReport?.severity ?? 0);
  }, [
    playerId,
    formFatigueReport?.report,
    formFatigueReport?.bodyPartId,
    formFatigueReport?.severity,
  ]);

  const bodyPartOptions = [
    "Head",
    "Neck",
    "Shoulder",
    "Arm",
    "Back",
    "Hip",
    "Knee",
    "Ankle",
    "Foot",
  ];

  const showBodyParts = fatigue === "injury" || fatigue === "fatigue";

  const handleFatigueChange = (val: string) => {
    const report = val as FatigueReportData["report"];
    setFatigue(report);
    const nextReport: FatigueReportData = {
      report,
      bodyPartId:
        report === "none" ? "" : (formFatigueReport?.bodyPartId ?? bodyPartId),
      severity: formFatigueReport?.severity ?? severity,
    };
    form.setFieldValue(`players.${playerId}.fatigueReport`, nextReport);

    if (val === "none") {
      setBodyPartId("");
    }
  };

  const handleBodyPartChange = (val: string) => {
    setBodyPartId(val);
    form.setFieldValue(`players.${playerId}.fatigueReport`, {
      report: formFatigueReport?.report ?? fatigue,
      bodyPartId: val,
      severity: formFatigueReport?.severity ?? severity,
    });
  };

  const handleSliderChange = (val: number | number[]) => {
    const num = val as number;
    setSeverity(num);
    form.setFieldValue(`players.${playerId}.fatigueReport`, {
      report: formFatigueReport?.report ?? fatigue,
      bodyPartId: formFatigueReport?.bodyPartId ?? bodyPartId,
      severity: num,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      setSeverity(num);
      form.setFieldValue(`players.${playerId}.fatigueReport`, {
        report: formFatigueReport?.report ?? fatigue,
        bodyPartId: formFatigueReport?.bodyPartId ?? bodyPartId,
        severity: num,
      });
    }
  };

  return (
    <Accordion variant="splitted" selectionMode="multiple" className="mt-2">
      <AccordionItem key="fatigue" aria-label="Fatigue" title="Fatigue">
        <div className="flex gap-8">
          <RadioGroup
            label="Select Fatigue Status"
            value={fatigue}
            onValueChange={handleFatigueChange}
          >
            <Radio value="injury">Injury</Radio>
            <Radio value="fatigue">Fatigue</Radio>
            <Radio value="none">None</Radio>
          </RadioGroup>

          {showBodyParts && (
            <RadioGroup
              label="Affected Body Part"
              value={bodyPartId}
              onValueChange={handleBodyPartChange}
            >
              <div className="grid grid-cols-3 gap-2">
                {bodyPartOptions.map((part) => (
                  <Radio key={part} value={part}>
                    {part}
                  </Radio>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <Slider
            className="flex-1"
            value={severity}
            onChange={handleSliderChange}
            label="Injury Severity"
            maxValue={10}
            minValue={0}
            showSteps={true}
            size="md"
            step={1}
          />
          <Input
            className="w-16"
            value={String(severity)}
            onChange={handleInputChange}
            type="number"
            min={0}
            max={10}
            size="sm"
          />
        </div>
      </AccordionItem>
    </Accordion>
  );
}

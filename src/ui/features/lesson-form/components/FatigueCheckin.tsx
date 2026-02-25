import { Accordion, AccordionItem, Radio, RadioGroup } from "@heroui/react";

import { useLessonFormContext } from "@/ui/features/lesson-form/LessonFormProvider";

type FatigueCheckinProps = {
  playerId: string;
};

export function FatigueCheckin({ playerId }: FatigueCheckinProps) {
  const { form } = useLessonFormContext();

  const fatigueMap = form.getFieldValue(`players.${playerId}.fatigue`) ?? {};

  return (
    <Accordion variant="splitted" selectionMode="multiple" className="mt-2">
      <AccordionItem key="fatigue" aria-label="Fatigue" title="Fatigue">
        <RadioGroup label="Select Fatigue Status" orientation="horizontal">
          <Radio value="injury">Injury</Radio>
          <Radio value="fatigue">Fatigue</Radio>
          <Radio value="none">None</Radio>
        </RadioGroup>
      </AccordionItem>
    </Accordion>
  );
}

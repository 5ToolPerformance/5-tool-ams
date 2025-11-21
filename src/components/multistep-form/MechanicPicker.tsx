import { Select, SelectItem } from "@heroui/react";

const DUMMY_MECHANICS = [
  {
    id: "1",
    name: "Mechanic 1",
    desc: "Description 1",
    discipline: "pitching",
  },
  {
    id: "2",
    name: "Mechanic 2",
    desc: "Description 2",
    discipline: "fielding",
  },
  {
    id: "3",
    name: "Mechanic 3",
    desc: "Description 3",
    discipline: "hitting",
  },
];

interface Mechanic {
  id: string;
  name: string;
  desc: string;
  discipline: string;
}

interface MechanicPickerProps {
  discipline: string;
}

export function MechanicPicker({ discipline }: MechanicPickerProps) {
  const filteredMechanics = DUMMY_MECHANICS.filter(
    (mechanic) => mechanic.discipline === discipline
  );

  return (
    <Select label="Select a Mechanic">
      {filteredMechanics.map((mechanic) => (
        <SelectItem key={mechanic.id}>{mechanic.name}</SelectItem>
      ))}
    </Select>
  );
}

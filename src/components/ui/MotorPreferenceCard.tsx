import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

import { MotorPreferencesSelect } from "@/types/database";

interface MotorPreferenceCardProps {
  motorPreference: MotorPreferencesSelect;
  className?: string;
}

export function MotorPreferenceCard({
  motorPreference,
  className = "",
}: MotorPreferenceCardProps) {
  // Format the assessment date for display

  return (
    <Card className={`w-full max-w-3xl ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-semibold">Motor Preferences</h3>
        <Chip color="primary" size="sm">
          date
        </Chip>
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500">Archetype</p>
            <p className="font-medium capitalize">
              {motorPreference.archetype}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Extension Leg</p>
            <p className="font-medium capitalize">
              {motorPreference.extensionLeg}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500">Breath</p>
            <p className="font-medium">
              {motorPreference.breath ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Association</p>
            <p className="font-medium">
              {motorPreference.association ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

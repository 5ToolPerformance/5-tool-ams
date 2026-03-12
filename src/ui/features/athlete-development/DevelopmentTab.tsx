import { Button, Card, CardBody } from "@heroui/react";

import type { PlayerDevelopmentTabData } from "@/application/players/development/getPlayerDevelopmentTabData";

import { ActivePlanPanel } from "./ActivePlanPanel";
import { CurrentSnapshotPanel } from "./CurrentSnapshotPanel";
import { DevelopmentDisciplineSelector } from "./DevelopmentDisciplineSelector";
import { DevelopmentHistoryPanel } from "./DevelopmentHistoryPanel";
import { RoutinesPanel } from "./RoutinesPanel";

interface DevelopmentTabProps {
  data: PlayerDevelopmentTabData;
}

export function DevelopmentTab({ data }: DevelopmentTabProps) {
  const selectedDiscipline = data.selectedDiscipline;

  if (!data.flags.hasAnyDisciplineData || !selectedDiscipline) {
    return (
      <Card shadow="sm">
        <CardBody className="space-y-3">
          <h2 className="text-lg font-semibold">Development</h2>
          <p className="text-sm text-muted-foreground">
            No development data exists yet for this athlete. Add an evaluation to
            begin the development workflow.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" color="primary" isDisabled>
              New Evaluation
            </Button>
            <Button size="sm" variant="flat" isDisabled>
              New Development Plan
            </Button>
            <Button size="sm" variant="flat" isDisabled>
              New Routine
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card shadow="sm">
        <CardBody className="space-y-3">
          <div>
            <h1 className="text-xl font-semibold">Development</h1>
            <p className="text-sm text-muted-foreground">
              Evaluation, development plan, and routine context for coaches.
            </p>
          </div>
          <DevelopmentDisciplineSelector
            selectedDisciplineId={selectedDiscipline.id}
            disciplines={data.disciplineOptions}
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" color="primary" isDisabled>
              New Evaluation
            </Button>
            <Button size="sm" variant="flat" isDisabled>
              New Development Plan
            </Button>
            <Button size="sm" variant="flat" isDisabled>
              New Routine
            </Button>
          </div>
        </CardBody>
      </Card>

      <CurrentSnapshotPanel
        latestEvaluation={data.latestEvaluation}
        disciplineKey={selectedDiscipline.key}
      />

      <ActivePlanPanel
        activePlan={data.activePlan}
        latestEvaluation={data.latestEvaluation}
        disciplineKey={selectedDiscipline.key}
      />

      <RoutinesPanel
        playerRoutines={data.playerRoutines}
        universalRoutinesSupported={data.universalRoutinesSupported}
        disciplineKey={selectedDiscipline.key}
      />

      <DevelopmentHistoryPanel
        evaluationHistory={data.evaluationHistory}
        developmentPlanHistory={data.developmentPlanHistory}
        disciplineKey={selectedDiscipline.key}
      />
    </div>
  );
}

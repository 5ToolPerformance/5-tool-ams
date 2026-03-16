import { Card, CardBody } from "@heroui/react";

import type { PlayerDevelopmentTabData } from "@/application/players/development/getPlayerDevelopmentTabData";

import { ActivePlanPanel } from "./ActivePlanPanel";
import { CurrentSnapshotPanel } from "./CurrentSnapshotPanel";
import { DevelopmentActionButtons } from "./DevelopmentActionButtons";
import { DevelopmentDisciplineSelector } from "./DevelopmentDisciplineSelector";
import { DevelopmentHistoryPanel } from "./DevelopmentHistoryPanel";
import { RoutinesPanel } from "./RoutinesPanel";

interface DevelopmentTabProps {
  playerId: string;
  createdBy: string;
  data: PlayerDevelopmentTabData;
}

export function DevelopmentTab({
  playerId,
  createdBy,
  data,
}: DevelopmentTabProps) {
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
          <DevelopmentActionButtons
            playerId={playerId}
            createdBy={createdBy}
            disciplineOptions={data.disciplineOptions}
          />
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
          <DevelopmentActionButtons
            playerId={playerId}
            createdBy={createdBy}
            disciplineOptions={data.disciplineOptions}
          />
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

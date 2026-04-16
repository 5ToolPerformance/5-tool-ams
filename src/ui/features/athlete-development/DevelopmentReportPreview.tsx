import type { DevelopmentReportData } from "@/application/players/development";
import { toHandednessAbbrev } from "@/utils/handedness";

import { formatDate } from "./utils";

interface DevelopmentReportPreviewProps {
  data: DevelopmentReportData;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="development-report-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DetailList({
  items,
}: {
  items: Array<{
    title: string;
    description: string | null;
    metricType?: string | null;
  }>;
}) {
  return (
    <div className="development-report-stack-sm">
      {items.map((item) => (
        <div
          key={`${item.title}-${item.metricType ?? ""}`}
          className="development-report-detail print:break-inside-avoid"
        >
          <div className="development-report-detail-header">
            <h4>{item.title}</h4>
            {item.metricType ? (
              <span className="development-report-pill">{item.metricType}</span>
            ) : null}
          </div>
          {item.description ? <p>{item.description}</p> : null}
        </div>
      ))}
    </div>
  );
}

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="development-report-meta-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function DevelopmentReportPreview({
  data,
}: DevelopmentReportPreviewProps) {
  const positions = data.player.positions.join(", ");
  const handedness = data.player.handedness
    ? `${toHandednessAbbrev(data.player.handedness.bat) ?? "?"}/${toHandednessAbbrev(
        data.player.handedness.throw
      ) ?? "?"}`
    : null;

  return (
    <article
      className="development-report-document print:shadow-none"
      data-testid="development-report-document"
    >
      <div aria-hidden="true" className="development-report-watermark">
        <img src="/logo.svg" alt="" />
      </div>

      <div className="development-report-content">
        <header className="development-report-header print:break-inside-avoid">
          <div className="development-report-eyebrow">Player Development Report</div>
          <div className="development-report-title-row">
            <div>
              <h1>{data.player.name}</h1>
              <p>{data.discipline.label} development summary for parent review</p>
            </div>
            <div className="development-report-title-aside">
              <span>Prepared {formatDate(data.generatedOn)}</span>
              {data.player.primaryCoachName ? (
                <span>Coach {data.player.primaryCoachName}</span>
              ) : null}
            </div>
          </div>

          <div className="development-report-meta-grid development-report-player-meta-row">
            <MetaRow
              label="Age"
              value={data.player.age !== null ? String(data.player.age) : null}
            />
            <MetaRow label="Positions" value={positions || null} />
            <MetaRow label="Handedness" value={handedness} />
          </div>

          <div className="development-report-meta-grid">
            <MetaRow label="Plan Status" value={data.plan.status} />
            <MetaRow
              label="Evaluation Date"
              value={formatDate(data.evaluation.date)}
            />
          </div>
        </header>

        <section className="development-report-section print:break-inside-avoid">
          <div className="development-report-section-heading">
            <h2>Evaluation Overview</h2>
            <div className="development-report-pill-row">
              <span className="development-report-pill">{data.evaluation.type}</span>
              <span className="development-report-pill">{data.evaluation.phase}</span>
            </div>
          </div>

          <div className="development-report-stack">
            <div className="development-report-summary-card">
              <h3>Current Snapshot</h3>
              <p>{data.evaluation.snapshotSummary}</p>
            </div>

            <div className="development-report-summary-card">
              <h3>Strength Summary</h3>
              <p>{data.evaluation.strengthProfileSummary}</p>
            </div>
          </div>

          {data.evaluation.strengths.length > 0 ? (
            <div className="development-report-block">
              <h3>Strengths</h3>
              <BulletList items={data.evaluation.strengths} />
            </div>
          ) : null}

          <div className="development-report-summary-card">
            <h3>Constraint Summary</h3>
            <p>{data.evaluation.keyConstraintsSummary}</p>
          </div>

          {data.evaluation.constraints.length > 0 ? (
            <div className="development-report-block">
              <h3>Constraints</h3>
              <BulletList items={data.evaluation.constraints} />
            </div>
          ) : null}

          {data.evaluation.focusAreas.length > 0 ? (
            <div className="development-report-block">
              <h3>Focus Areas</h3>
              <DetailList items={data.evaluation.focusAreas} />
            </div>
          ) : null}

          {data.evaluation.evidence.length > 0 ? (
            <div className="development-report-block">
              <h3>Evaluation Evidence</h3>
              <div className="development-report-stack-sm">
                {data.evaluation.evidence.map((item, index) => (
                  <div
                    key={`${item.performanceSessionId ?? "evidence"}-${index}`}
                    className="development-report-detail print:break-inside-avoid"
                  >
                    {item.performanceSessionId ? (
                      <h4>Session {item.performanceSessionId}</h4>
                    ) : null}
                    {item.notes ? <p>{item.notes}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="development-report-section print:break-inside-avoid">
          <div className="development-report-section-heading">
            <h2>Development Plan</h2>
            <div className="development-report-pill-row">
              <span className="development-report-pill">
                Start {formatDate(data.plan.startDate)}
              </span>
              <span className="development-report-pill">
                Target End {formatDate(data.plan.targetEndDate)}
              </span>
            </div>
          </div>

          {data.plan.summary ? (
            <div className="development-report-callout">
              <h3>Plan Summary</h3>
              <p>{data.plan.summary}</p>
            </div>
          ) : null}

          {data.plan.currentPriority ? (
            <div className="development-report-callout">
              <h3>Current Priority</h3>
              <p>{data.plan.currentPriority}</p>
            </div>
          ) : null}

          {data.plan.shortTermGoals.length > 0 ? (
            <div className="development-report-block">
              <h3>Short-Term Goals</h3>
              <DetailList items={data.plan.shortTermGoals} />
            </div>
          ) : null}

          {data.plan.longTermGoals.length > 0 ? (
            <div className="development-report-block">
              <h3>Long-Term Goals</h3>
              <DetailList items={data.plan.longTermGoals} />
            </div>
          ) : null}

          {data.plan.focusAreas.length > 0 ? (
            <div className="development-report-block">
              <h3>Plan Focus Areas</h3>
              <DetailList items={data.plan.focusAreas} />
            </div>
          ) : null}

          {data.plan.measurableIndicators.length > 0 ? (
            <div className="development-report-block">
              <h3>Measurable Indicators</h3>
              <DetailList items={data.plan.measurableIndicators} />
            </div>
          ) : null}
        </section>

        {data.routines.length > 0 ? (
          <section className="development-report-section">
            <div className="development-report-section-heading">
              <h2>Selected Routines</h2>
            </div>
            <div className="development-report-stack">
              {data.routines.map((routine) => (
                <div
                  key={routine.id}
                  className="development-report-routine print:break-inside-avoid"
                >
                  <div className="development-report-routine-header">
                    <div>
                      <h3>{routine.title}</h3>
                      {routine.description ? <p>{routine.description}</p> : null}
                    </div>
                    <span className="development-report-pill">
                      {routine.routineType.replaceAll("_", " ")}
                    </span>
                  </div>

                  {routine.summary ? (
                    <p className="development-report-routine-copy">
                      {routine.summary}
                    </p>
                  ) : null}
                  {routine.usageNotes ? (
                    <p className="development-report-routine-copy development-report-muted">
                      {routine.usageNotes}
                    </p>
                  ) : null}

                  {routine.mechanics.length > 0 ? (
                    <div className="development-report-pill-row">
                      {routine.mechanics.map((mechanic) => (
                        <span key={mechanic} className="development-report-pill">
                          {mechanic}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {routine.blocks.length > 0 ? (
                    <div className="development-report-stack-sm">
                      {routine.blocks.map((block) => (
                        <div
                          key={block.id}
                          className="development-report-detail print:break-inside-avoid"
                        >
                          <h4>{block.title}</h4>
                          {block.notes ? <p>{block.notes}</p> : null}
                          {block.drills.length > 0 ? (
                            <ul className="development-report-list">
                              {block.drills.map((drill, index) => (
                                <li
                                  key={`${drill.drillId ?? drill.title ?? "drill"}-${index}`}
                                >
                                  <strong>{drill.title ?? "Untitled drill"}</strong>
                                  {drill.notes ? `: ${drill.notes}` : ""}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}

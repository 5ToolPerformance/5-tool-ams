import type { DevelopmentReportData } from "@/application/players/development";
import { toHandednessAbbrev } from "@/utils/handedness";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "N/A";

  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateValue);
}

function renderMetaRow(label: string, value: string | null) {
  if (!value) {
    return "";
  }

  return `
    <div class="development-report-meta-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderBulletList(items: string[]) {
  return `
    <ul class="development-report-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderDetailList(
  items: Array<{
    title: string;
    description: string | null;
    metricType?: string | null;
  }>
) {
  return `
    <div class="development-report-stack-sm">
      ${items
        .map(
          (item) => `
            <div class="development-report-detail">
              <div class="development-report-detail-header">
                <h4>${escapeHtml(item.title)}</h4>
                ${
                  item.metricType
                    ? `<span class="development-report-pill">${escapeHtml(item.metricType)}</span>`
                    : ""
                }
              </div>
              ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

export function getDevelopmentReportPdfHtml(
  data: DevelopmentReportData,
  input: { logoDataUri: string }
) {
  const positions = data.player.positions.join(", ");
  const handedness = data.player.handedness
    ? `${toHandednessAbbrev(data.player.handedness.bat) ?? "?"}/${toHandednessAbbrev(
        data.player.handedness.throw
      ) ?? "?"}`
    : null;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(data.player.name)} Development Report</title>
        <style>
          @page {
            size: letter;
            margin: 0.5in;
          }

          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          html, body {
            margin: 0;
            padding: 0;
            color: #13233f;
            background: #ffffff;
            font-family: Georgia, "Times New Roman", serif;
          }

          body {
            font-size: 12px;
            line-height: 1.55;
          }

          .development-report-document {
            position: relative;
            max-width: 100%;
            padding: 0.06in 0;
          }

          .development-report-watermark {
            position: fixed;
            inset: 50% auto auto 50%;
            transform: translate(-50%, -50%);
            opacity: 0.08;
            pointer-events: none;
            z-index: 0;
          }

          .development-report-watermark img {
            width: 340px;
            height: auto;
            display: block;
          }

          .development-report-content {
            position: relative;
            z-index: 1;
          }

          .development-report-header,
          .development-report-section,
          .development-report-summary-card,
          .development-report-callout,
          .development-report-detail,
          .development-report-routine,
          .development-report-meta-item {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .development-report-header {
            border-bottom: 1px solid #8aa0c7;
            padding-bottom: 0.18in;
          }

          .development-report-eyebrow {
            color: #294a7f;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.24em;
            margin-bottom: 10px;
            text-transform: uppercase;
          }

          .development-report-title-row,
          .development-report-section-heading,
          .development-report-detail-header,
          .development-report-routine-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 14px;
          }

          .development-report-title-row h1 {
            margin: 0;
            font-size: 30px;
            line-height: 1;
            letter-spacing: -0.04em;
            color: #13233f;
          }

          .development-report-title-row p,
          .development-report-title-aside,
          .development-report-muted {
            color: #3d5478;
          }

          .development-report-title-row p {
            margin: 8px 0 0;
            font-size: 14px;
          }

          .development-report-title-aside {
            display: flex;
            flex-direction: column;
            gap: 6px;
            text-align: right;
            font-size: 13px;
            flex-shrink: 0;
          }

          .development-report-meta-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            margin-top: 18px;
          }

          .development-report-player-meta-row {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .development-report-meta-item,
          .development-report-summary-card,
          .development-report-callout,
          .development-report-detail,
          .development-report-routine {
            border: 1px solid #b9c9e3;
            border-radius: 12px;
            background: rgba(235, 241, 251, 0.72);
            padding: 12px 14px;
          }

          .development-report-meta-item span {
            display: block;
            color: #365885;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 5px;
          }

          .development-report-meta-item strong {
            color: #13233f;
            font-size: 13px;
          }

          .development-report-section {
            border-top: 1px solid #d2dcf0;
            margin-top: 22px;
            padding-top: 18px;
          }

          .development-report-section-heading {
            margin-bottom: 14px;
          }

          .development-report-section-heading h2 {
            margin: 0;
            font-size: 22px;
            color: #15315a;
          }

          .development-report-pill-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .development-report-pill {
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            border: 1px solid #8ba7d2;
            background: #d9e5f8;
            color: #23436d;
            font-size: 10px;
            font-weight: 700;
            line-height: 1;
            padding: 7px 10px;
            text-transform: capitalize;
          }

          .development-report-stack,
          .development-report-stack-sm {
            display: flex;
            flex-direction: column;
          }

          .development-report-stack {
            gap: 12px;
          }

          .development-report-stack-sm {
            gap: 10px;
          }

          .development-report-summary-card h3,
          .development-report-callout h3,
          .development-report-block h3,
          .development-report-routine h3,
          .development-report-detail h4 {
            margin: 0 0 8px;
            color: #17325a;
          }

          .development-report-summary-card p,
          .development-report-callout p,
          .development-report-detail p,
          .development-report-routine p {
            margin: 0;
            color: #243956;
          }

          .development-report-block {
            margin-top: 14px;
          }

          .development-report-list {
            margin: 0;
            padding-left: 18px;
            color: #223752;
          }

          .development-report-list li + li {
            margin-top: 6px;
          }

          .development-report-routine-copy {
            margin-top: 10px !important;
          }
        </style>
      </head>
      <body>
        <article class="development-report-document">
          <div class="development-report-watermark" aria-hidden="true">
            <img src="${input.logoDataUri}" alt="" />
          </div>
          <div class="development-report-content">
            <header class="development-report-header">
              <div class="development-report-eyebrow">Player Development Report</div>
              <div class="development-report-title-row">
                <div>
                  <h1>${escapeHtml(data.player.name)}</h1>
                  <p>${escapeHtml(data.discipline.label)} development summary for parent review</p>
                </div>
                <div class="development-report-title-aside">
                  <span>Prepared ${escapeHtml(formatDate(data.generatedOn))}</span>
                  ${
                    data.player.primaryCoachName
                      ? `<span>Coach ${escapeHtml(data.player.primaryCoachName)}</span>`
                      : ""
                  }
                </div>
              </div>

              <div class="development-report-meta-grid development-report-player-meta-row">
                ${renderMetaRow(
                  "Age",
                  data.player.age !== null ? String(data.player.age) : null
                )}
                ${renderMetaRow("Positions", positions || null)}
                ${renderMetaRow("Handedness", handedness)}
              </div>

              <div class="development-report-meta-grid">
                ${renderMetaRow("Plan Status", data.plan.status)}
                ${renderMetaRow("Evaluation Date", formatDate(data.evaluation.date))}
              </div>
            </header>

            <section class="development-report-section">
              <div class="development-report-section-heading">
                <h2>Evaluation Overview</h2>
                <div class="development-report-pill-row">
                  <span class="development-report-pill">${escapeHtml(data.evaluation.type)}</span>
                  <span class="development-report-pill">${escapeHtml(data.evaluation.phase)}</span>
                </div>
              </div>

              <div class="development-report-stack">
                <div class="development-report-summary-card">
                  <h3>Current Snapshot</h3>
                  <p>${escapeHtml(data.evaluation.snapshotSummary)}</p>
                </div>
                <div class="development-report-summary-card">
                  <h3>Strength Summary</h3>
                  <p>${escapeHtml(data.evaluation.strengthProfileSummary)}</p>
                </div>
              </div>

              ${
                data.evaluation.strengths.length > 0
                  ? `<div class="development-report-block"><h3>Strengths</h3>${renderBulletList(
                      data.evaluation.strengths
                    )}</div>`
                  : ""
              }

              <div class="development-report-summary-card">
                <h3>Constraint Summary</h3>
                <p>${escapeHtml(data.evaluation.keyConstraintsSummary)}</p>
              </div>

              ${
                data.evaluation.constraints.length > 0
                  ? `<div class="development-report-block"><h3>Constraints</h3>${renderBulletList(
                      data.evaluation.constraints
                    )}</div>`
                  : ""
              }

              ${
                data.evaluation.focusAreas.length > 0
                  ? `<div class="development-report-block"><h3>Focus Areas</h3>${renderDetailList(
                      data.evaluation.focusAreas
                    )}</div>`
                  : ""
              }

              ${
                data.evaluation.evidence.length > 0
                  ? `<div class="development-report-block"><h3>Evaluation Evidence</h3><div class="development-report-stack-sm">${data.evaluation.evidence
                      .map(
                        (item) => `
                          <div class="development-report-detail">
                            ${
                              item.performanceSessionId
                                ? `<h4>Session ${escapeHtml(item.performanceSessionId)}</h4>`
                                : ""
                            }
                            ${item.notes ? `<p>${escapeHtml(item.notes)}</p>` : ""}
                          </div>
                        `
                      )
                      .join("")}</div></div>`
                  : ""
              }
            </section>

            <section class="development-report-section">
              <div class="development-report-section-heading">
                <h2>Development Plan</h2>
                <div class="development-report-pill-row">
                  <span class="development-report-pill">Start ${escapeHtml(
                    formatDate(data.plan.startDate)
                  )}</span>
                  <span class="development-report-pill">Target End ${escapeHtml(
                    formatDate(data.plan.targetEndDate)
                  )}</span>
                </div>
              </div>

              ${
                data.plan.summary
                  ? `<div class="development-report-callout"><h3>Plan Summary</h3><p>${escapeHtml(
                      data.plan.summary
                    )}</p></div>`
                  : ""
              }
              ${
                data.plan.currentPriority
                  ? `<div class="development-report-callout"><h3>Current Priority</h3><p>${escapeHtml(
                      data.plan.currentPriority
                    )}</p></div>`
                  : ""
              }
              ${
                data.plan.shortTermGoals.length > 0
                  ? `<div class="development-report-block"><h3>Short-Term Goals</h3>${renderDetailList(
                      data.plan.shortTermGoals
                    )}</div>`
                  : ""
              }
              ${
                data.plan.longTermGoals.length > 0
                  ? `<div class="development-report-block"><h3>Long-Term Goals</h3>${renderDetailList(
                      data.plan.longTermGoals
                    )}</div>`
                  : ""
              }
              ${
                data.plan.focusAreas.length > 0
                  ? `<div class="development-report-block"><h3>Plan Focus Areas</h3>${renderDetailList(
                      data.plan.focusAreas
                    )}</div>`
                  : ""
              }
              ${
                data.plan.measurableIndicators.length > 0
                  ? `<div class="development-report-block"><h3>Measurable Indicators</h3>${renderDetailList(
                      data.plan.measurableIndicators
                    )}</div>`
                  : ""
              }
            </section>

            ${
              data.routines.length > 0
                ? `<section class="development-report-section">
                    <div class="development-report-section-heading">
                      <h2>Selected Routines</h2>
                    </div>
                    <div class="development-report-stack">
                      ${data.routines
                        .map(
                          (routine) => `
                            <div class="development-report-routine">
                              <div class="development-report-routine-header">
                                <div>
                                  <h3>${escapeHtml(routine.title)}</h3>
                                  ${
                                    routine.description
                                      ? `<p>${escapeHtml(routine.description)}</p>`
                                      : ""
                                  }
                                </div>
                                <span class="development-report-pill">${escapeHtml(
                                  routine.routineType.replaceAll("_", " ")
                                )}</span>
                              </div>
                              ${
                                routine.summary
                                  ? `<p class="development-report-routine-copy">${escapeHtml(
                                      routine.summary
                                    )}</p>`
                                  : ""
                              }
                              ${
                                routine.usageNotes
                                  ? `<p class="development-report-routine-copy development-report-muted">${escapeHtml(
                                      routine.usageNotes
                                    )}</p>`
                                  : ""
                              }
                              ${
                                routine.mechanics.length > 0
                                  ? `<div class="development-report-pill-row">${routine.mechanics
                                      .map(
                                        (mechanic) =>
                                          `<span class="development-report-pill">${escapeHtml(
                                            mechanic
                                          )}</span>`
                                      )
                                      .join("")}</div>`
                                  : ""
                              }
                              ${
                                routine.blocks.length > 0
                                  ? `<div class="development-report-stack-sm">${routine.blocks
                                      .map(
                                        (block) => `
                                          <div class="development-report-detail">
                                            <h4>${escapeHtml(block.title)}</h4>
                                            ${
                                              block.notes
                                                ? `<p>${escapeHtml(block.notes)}</p>`
                                                : ""
                                            }
                                            ${
                                              block.drills.length > 0
                                                ? `<ul class="development-report-list">${block.drills
                                                    .map(
                                                      (drill) => `
                                                        <li>
                                                          <strong>${escapeHtml(
                                                            drill.title ?? "Untitled drill"
                                                          )}</strong>${
                                                            drill.notes
                                                              ? `: ${escapeHtml(drill.notes)}`
                                                              : ""
                                                          }
                                                        </li>
                                                      `
                                                    )
                                                    .join("")}</ul>`
                                                : ""
                                            }
                                          </div>
                                        `
                                      )
                                      .join("")}</div>`
                                  : ""
                              }
                            </div>
                          `
                        )
                        .join("")}
                    </div>
                  </section>`
                : ""
            }
          </div>
        </article>
      </body>
    </html>
  `;
}

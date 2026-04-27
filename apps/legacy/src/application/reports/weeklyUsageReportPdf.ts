import { WeeklyUsageReportDocument } from "@/domain/admin/weeklyUsageReport/types";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value: string | null | undefined, timeZone = "America/New_York") {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(date);
}

function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

function renderSummaryCard(label: string, value: number) {
  return `
    <section class="weekly-usage-summary-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(formatCount(value))}</strong>
    </section>
  `;
}

function renderCoachRows(document: WeeklyUsageReportDocument) {
  if (document.coaches.items.length === 0) {
    return `
      <tr>
        <td colspan="8" class="weekly-usage-empty">No coach lesson activity for this week.</td>
      </tr>
    `;
  }

  return document.coaches.items
    .map(
      (coach) => `
        <tr>
          <td>${escapeHtml(coach.coachName)}</td>
          <td class="weekly-usage-number">${escapeHtml(
            formatCount(coach.totals.lessonsLogged)
          )}</td>
          <td class="weekly-usage-number">${escapeHtml(
            formatCount(coach.totals.playersWorkedWith)
          )}</td>
          <td class="weekly-usage-number">${escapeHtml(
            formatCount(coach.lessonsByType.hitting)
          )}</td>
          <td class="weekly-usage-number">${escapeHtml(
            formatCount(coach.lessonsByType.pitching)
          )}</td>
          <td class="weekly-usage-number">${escapeHtml(
            formatCount(coach.lessonsByType.fielding)
          )}</td>
          <td class="weekly-usage-number">${escapeHtml(
            formatCount(coach.lessonsByType.catching)
          )}</td>
          <td class="weekly-usage-number">${escapeHtml(
            formatCount(
              coach.lessonsByType.strength +
                coach.lessonsByType.recovery +
                coach.lessonsByType.other
            )
          )}</td>
        </tr>
      `
    )
    .join("");
}

export function getWeeklyUsageReportPdfHtml(
  document: WeeklyUsageReportDocument,
  input: { generatedAt: string | null; logoDataUri: string }
) {
  const generatedLabel = input.generatedAt
    ? formatDate(input.generatedAt, document.range.timezone)
    : "Pending";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(document.range.label)} Weekly Usage Report</title>
        <style>
          @page { size: letter; margin: 0.5in; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body { margin: 0; padding: 0; background: #f4f7fc; color: #10233f; font-family: Georgia, "Times New Roman", serif; }
          body { font-size: 12px; line-height: 1.5; }
          .weekly-usage-document { position: relative; padding: 0.05in 0; }
          .weekly-usage-watermark { position: fixed; inset: 50% auto auto 50%; transform: translate(-50%, -50%); opacity: 0.08; pointer-events: none; }
          .weekly-usage-watermark img { width: 340px; display: block; }
          .weekly-usage-content { position: relative; z-index: 1; }
          .weekly-usage-header, .weekly-usage-summary-card, .weekly-usage-panel, .weekly-usage-table { break-inside: avoid; page-break-inside: avoid; }
          .weekly-usage-header { border-bottom: 1px solid #bccbe0; padding-bottom: 18px; }
          .weekly-usage-eyebrow { margin-bottom: 10px; color: #224d86; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; }
          .weekly-usage-title-row, .weekly-usage-meta-grid, .weekly-usage-summary-grid { display: flex; gap: 14px; }
          .weekly-usage-title-row { align-items: flex-start; justify-content: space-between; }
          .weekly-usage-title-row h1 { margin: 0; font-size: 30px; line-height: 1; letter-spacing: -0.04em; }
          .weekly-usage-title-row p, .weekly-usage-generated { color: #425d86; }
          .weekly-usage-title-row p { margin: 8px 0 0; font-size: 14px; }
          .weekly-usage-generated { text-align: right; font-size: 12px; }
          .weekly-usage-meta-grid, .weekly-usage-summary-grid { flex-wrap: wrap; margin-top: 18px; }
          .weekly-usage-panel, .weekly-usage-summary-card { border: 1px solid #c2d2ea; border-radius: 14px; background: rgba(229, 238, 251, 0.82); }
          .weekly-usage-panel { padding: 14px 16px; margin-top: 18px; }
          .weekly-usage-meta-item, .weekly-usage-summary-card { flex: 1 1 0; min-width: 120px; padding: 12px 14px; }
          .weekly-usage-meta-item span, .weekly-usage-summary-card span { display: block; color: #224d86; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
          .weekly-usage-meta-item strong, .weekly-usage-summary-card strong { display: block; margin-top: 6px; font-size: 22px; color: #10233f; }
          .weekly-usage-section-title { margin: 0 0 10px; font-size: 20px; }
          .weekly-usage-notes { margin: 10px 0 0; padding-left: 18px; }
          .weekly-usage-table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          .weekly-usage-table th, .weekly-usage-table td { border-bottom: 1px solid #d1ddee; padding: 10px 8px; text-align: left; vertical-align: top; }
          .weekly-usage-table th { color: #224d86; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
          .weekly-usage-number { text-align: right !important; white-space: nowrap; }
          .weekly-usage-empty { color: #425d86; text-align: center; padding: 18px 8px; }
        </style>
      </head>
      <body>
        <article class="weekly-usage-document">
          <div class="weekly-usage-watermark" aria-hidden="true">
            <img src="${input.logoDataUri}" alt="" />
          </div>
          <div class="weekly-usage-content">
            <header class="weekly-usage-header">
              <div class="weekly-usage-eyebrow">Facility Weekly Usage Report</div>
              <div class="weekly-usage-title-row">
                <div>
                  <h1>${escapeHtml(document.scope.facilityName ?? "Facility")}</h1>
                  <p>${escapeHtml(document.range.label)} · ${escapeHtml(document.range.timezone)}</p>
                </div>
                <div class="weekly-usage-generated">Generated ${escapeHtml(generatedLabel)}</div>
              </div>

              <div class="weekly-usage-meta-grid">
                <div class="weekly-usage-panel weekly-usage-meta-item">
                  <span>Week Start</span>
                  <strong>${escapeHtml(
                    formatDate(document.range.weekStart, document.range.timezone)
                  )}</strong>
                </div>
                <div class="weekly-usage-panel weekly-usage-meta-item">
                  <span>Week End</span>
                  <strong>${escapeHtml(
                    formatDate(document.range.weekEnd, document.range.timezone)
                  )}</strong>
                </div>
                <div class="weekly-usage-panel weekly-usage-meta-item">
                  <span>Coaches Included</span>
                  <strong>${escapeHtml(
                    formatCount(document.coaches.totalCoachesIncluded)
                  )}</strong>
                </div>
              </div>
            </header>

            <section class="weekly-usage-panel">
              <h2 class="weekly-usage-section-title">Weekly Summary</h2>
              <div class="weekly-usage-summary-grid">
                ${renderSummaryCard("Lessons Created", document.summary.lessonsCreated)}
                ${renderSummaryCard("Active Coaches", document.summary.activeCoaches)}
                ${renderSummaryCard("Active Players", document.summary.activePlayers)}
                ${renderSummaryCard("New Players Added", document.summary.newPlayersAdded)}
                ${renderSummaryCard("Injuries Logged", document.summary.injuriesLogged)}
              </div>
            </section>

            <section class="weekly-usage-panel">
              <h2 class="weekly-usage-section-title">Coach Breakdown</h2>
              <table class="weekly-usage-table" aria-label="Coach breakdown">
                <thead>
                  <tr>
                    <th>Coach</th>
                    <th class="weekly-usage-number">Lessons</th>
                    <th class="weekly-usage-number">Players</th>
                    <th class="weekly-usage-number">Hitting</th>
                    <th class="weekly-usage-number">Pitching</th>
                    <th class="weekly-usage-number">Fielding</th>
                    <th class="weekly-usage-number">Catching</th>
                    <th class="weekly-usage-number">Strength</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderCoachRows(document)}
                </tbody>
              </table>
            </section>

            ${
              document.notes?.warnings && document.notes.warnings.length > 0
                ? `
                  <section class="weekly-usage-panel">
                    <h2 class="weekly-usage-section-title">Warnings</h2>
                    <ul class="weekly-usage-notes">
                      ${document.notes.warnings
                        .map((warning) => `<li>${escapeHtml(warning)}</li>`)
                        .join("")}
                    </ul>
                  </section>
                `
                : ""
            }
          </div>
        </article>
      </body>
    </html>
  `;
}

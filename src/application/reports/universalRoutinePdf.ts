import type { UniversalRoutinePdfData } from "@/application/routines/getUniversalRoutinePdfData";

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

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(date);
}

function renderList(items: string[]) {
  if (items.length === 0) {
    return "<p class=\"routine-report-muted\">None listed.</p>";
  }

  return `<div class="routine-report-pill-row">${items
    .map((item) => `<span class="routine-report-pill">${escapeHtml(item)}</span>`)
    .join("")}</div>`;
}

export function getUniversalRoutinePdfHtml(
  data: UniversalRoutinePdfData,
  input: { logoDataUri: string }
) {
  const { routine } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(routine.title)} Routine</title>
        <style>
          @page { size: letter; margin: 0.5in; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body { margin: 0; padding: 0; background: #f6f7fb; color: #14243d; font-family: Georgia, "Times New Roman", serif; }
          body { font-size: 12px; line-height: 1.5; }
          .routine-report-document { position: relative; padding: 0.05in 0; }
          .routine-report-watermark { position: fixed; inset: 50% auto auto 50%; transform: translate(-50%, -50%); opacity: 0.07; pointer-events: none; }
          .routine-report-watermark img { width: 320px; display: block; }
          .routine-report-content { position: relative; z-index: 1; }
          .routine-report-header, .routine-report-card, .routine-report-detail { break-inside: avoid; page-break-inside: avoid; }
          .routine-report-header { border-bottom: 1px solid #c4d0e4; padding-bottom: 16px; }
          .routine-report-eyebrow { margin-bottom: 10px; color: #264d82; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; }
          .routine-report-title-row, .routine-report-card-header { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; }
          .routine-report-title-row h1 { margin: 0; font-size: 30px; line-height: 1; letter-spacing: -0.04em; }
          .routine-report-title-row p, .routine-report-muted, .routine-report-header-aside { color: #4a5f82; }
          .routine-report-title-row p { margin: 8px 0 0; font-size: 14px; }
          .routine-report-header-aside { text-align: right; font-size: 12px; }
          .routine-report-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 18px; }
          .routine-report-meta-item, .routine-report-card, .routine-report-detail { border: 1px solid #c6d2e8; border-radius: 14px; background: rgba(232, 239, 250, 0.8); }
          .routine-report-meta-item { min-width: 150px; padding: 12px 14px; }
          .routine-report-meta-item span { display: block; color: #264d82; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
          .routine-report-meta-item strong { display: block; margin-top: 6px; font-size: 16px; color: #14243d; }
          .routine-report-stack { display: flex; flex-direction: column; gap: 14px; margin-top: 20px; }
          .routine-report-card { padding: 16px 18px; }
          .routine-report-card h2, .routine-report-detail h4 { margin: 0; color: #17345d; }
          .routine-report-card p, .routine-report-detail p { margin: 0; }
          .routine-report-pill-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
          .routine-report-pill { display: inline-flex; align-items: center; padding: 7px 10px; border-radius: 999px; border: 1px solid #8ba7d2; background: #dce8fa; color: #264d82; font-size: 10px; font-weight: 700; text-transform: capitalize; }
          .routine-report-copy { margin-top: 10px !important; }
          .routine-report-detail-stack { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
          .routine-report-detail { padding: 12px 14px; }
          .routine-report-list { margin: 8px 0 0; padding-left: 18px; color: #223752; }
          .routine-report-list li + li { margin-top: 6px; }
        </style>
      </head>
      <body>
        <article class="routine-report-document">
          <div class="routine-report-watermark" aria-hidden="true">
            <img src="${input.logoDataUri}" alt="" />
          </div>
          <div class="routine-report-content">
            <header class="routine-report-header">
              <div class="routine-report-eyebrow">Universal Routine Export</div>
              <div class="routine-report-title-row">
                <div>
                  <h1>${escapeHtml(routine.title)}</h1>
                  <p>${escapeHtml(routine.discipline.label)} printable routine</p>
                </div>
                <div class="routine-report-header-aside">
                  <div>Prepared ${escapeHtml(formatDate(data.generatedOn))}</div>
                  ${
                    routine.createdByName
                      ? `<div>Coach ${escapeHtml(routine.createdByName)}</div>`
                      : ""
                  }
                </div>
              </div>
              <div class="routine-report-meta">
                <div class="routine-report-meta-item">
                  <span>Discipline</span>
                  <strong>${escapeHtml(routine.discipline.label)}</strong>
                </div>
                <div class="routine-report-meta-item">
                  <span>Routine Type</span>
                  <strong>${escapeHtml(routine.routineType.replaceAll("_", " "))}</strong>
                </div>
              </div>
            </header>
            <section class="routine-report-stack">
              <div class="routine-report-card">
                <div class="routine-report-card-header">
                  <div>
                    <h2>${escapeHtml(routine.title)}</h2>
                    ${
                      routine.description
                        ? `<p class="routine-report-copy">${escapeHtml(routine.description)}</p>`
                        : ""
                    }
                  </div>
                  <span class="routine-report-pill">${escapeHtml(
                    routine.routineType.replaceAll("_", " ")
                  )}</span>
                </div>
                ${
                  routine.summary
                    ? `<p class="routine-report-copy">${escapeHtml(routine.summary)}</p>`
                    : ""
                }
                ${
                  routine.usageNotes
                    ? `<p class="routine-report-copy routine-report-muted">${escapeHtml(
                        routine.usageNotes
                      )}</p>`
                    : ""
                }
                ${renderList(routine.mechanics)}
                ${
                  routine.blocks.length > 0
                    ? `<div class="routine-report-detail-stack">${routine.blocks
                        .map(
                          (block) => `
                            <div class="routine-report-detail">
                              <h4>${escapeHtml(block.title)}</h4>
                              ${
                                block.notes
                                  ? `<p class="routine-report-copy">${escapeHtml(block.notes)}</p>`
                                  : ""
                              }
                              ${
                                block.drills.length > 0
                                  ? `<ul class="routine-report-list">${block.drills
                                      .map(
                                        (drill) => `
                                          <li>
                                            <strong>${escapeHtml(
                                              drill.title ?? "Untitled drill"
                                            )}</strong>${
                                              drill.notes ? `: ${escapeHtml(drill.notes)}` : ""
                                            }
                                          </li>
                                        `
                                      )
                                      .join("")}</ul>`
                                  : "<p class=\"routine-report-copy routine-report-muted\">No drills listed.</p>"
                              }
                            </div>
                          `
                        )
                        .join("")}</div>`
                    : "<p class=\"routine-report-copy routine-report-muted\">No blocks listed.</p>"
                }
              </div>
            </section>
          </div>
        </article>
      </body>
    </html>
  `;
}

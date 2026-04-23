export function formatDate(value: Date | string | null | undefined) {
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

export function getDisciplineAccentClass(disciplineKey?: string | null) {
  switch (disciplineKey) {
    case "pitching":
      return "border-l-emerald-500";
    case "hitting":
      return "border-l-amber-500";
    case "fielding":
      return "border-l-sky-500";
    case "catching":
      return "border-l-violet-500";
    case "strength":
      return "border-l-rose-500";
    default:
      return "border-l-zinc-400";
  }
}

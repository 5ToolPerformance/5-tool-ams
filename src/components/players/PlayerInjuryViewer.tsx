import { Card, CardBody } from "@heroui/react";

import { usePlayerInjuries } from "@/hooks/players";

interface PlayerInjuryViewerProps {
  playerId: string;
}

export function PlayerInjuryViewer({ playerId }: PlayerInjuryViewerProps) {
  const { injuries, isLoading, error } = usePlayerInjuries(playerId);

  if (isLoading) {
    return <p className="text-default-500">Loading injuries...</p>;
  }

  if (error) {
    return <p className="text-danger">Error loading injuries</p>;
  }

  const injuriesList = Array.isArray(injuries) ? injuries : [];

  const sortedInjuries = [...injuriesList].sort((a: any, b: any) => {
    const aResolved = a.status === "inactive" || a.status === "resolved";
    const bResolved = b.status === "inactive" || b.status === "resolved";

    if (aResolved !== bResolved) {
      return aResolved ? 1 : -1;
    }

    const aTime = a.injuryDate ? Date.parse(a.injuryDate as string) : 0;
    const bTime = b.injuryDate ? Date.parse(b.injuryDate as string) : 0;

    return bTime - aTime;
  });

  if (sortedInjuries.length === 0) {
    return <p className="text-sm text-default-500">No injuries recorded.</p>;
  }

  return (
    <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
      {sortedInjuries.map((injury: any, index: number) => {
        const severity = (injury.severity || "unknown") as string;
        const status = (injury.status || "") as string;
        const injuryName = (injury.injury || "") as string;
        const injuryDate = (injury.injuryDate || "") as string;
        const description = (injury.description || "") as string;
        const notes = (injury.notes || "") as string;

        const borderColorClass =
          severity === "severe"
            ? "border-red-500"
            : severity === "moderate"
              ? "border-orange-500"
              : severity === "minor"
                ? "border-yellow-500"
                : "border-default-200";

        const titleText = [
          description ? `Description: ${description}` : "",
          notes ? `Notes: ${notes}` : "",
        ]
          .filter(Boolean)
          .join("\n");

        return (
          <Card
            key={injury.id ?? index}
            className={`group cursor-pointer border ${borderColorClass}`}
            title={titleText}
          >
            <CardBody className="p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-semibold">{injuryName}</span>
                <span className="ml-2 text-xs text-default-500">
                  {injuryDate}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-default-600">
                <span>Status: {status || "N/A"}</span>
                <span>Severity: {severity}</span>
              </div>
              {(description || notes) && (
                <div className="mt-2 text-xs text-default-500 opacity-0 transition-opacity group-hover:opacity-100">
                  {description && <p className="line-clamp-2">{description}</p>}
                  {notes && <p className="mt-1 line-clamp-2">{notes}</p>}
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

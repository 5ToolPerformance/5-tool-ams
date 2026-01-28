import { format } from "date-fns";

import { SectionShell } from "@/ui/core/athletes/SectionShell";

type RecentActivityItem =
  | {
      type: "lesson";
      id: string;
      date: string;
      discipline: string;
      summary?: string;
    }
  | {
      type: "note";
      id: string;
      date: string;
      author: string;
      preview: string;
    };

interface RecentActivitySectionProps {
  items: RecentActivityItem[];
}

export function RecentActivitySection({ items }: RecentActivitySectionProps) {
  return (
    <SectionShell
      title="Recent Activity"
      description="Most recent lessons and notes"
    >
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent activity.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {items.map((item) => (
            <li key={`${item.type}-${item.id}`}>
              <span className="font-medium">
                {format(new Date(item.date), "MM/dd")}
              </span>{" "}
              —{" "}
              {item.type === "lesson" ? (
                <>
                  {capitalize(item.discipline)} Lesson
                  {item.summary && (
                    <span className="text-muted-foreground">
                      {" "}
                      · {item.summary}
                    </span>
                  )}
                </>
              ) : (
                <>
                  Note added by {item.author}
                  <span className="text-muted-foreground">
                    {" "}
                    · {item.preview}
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

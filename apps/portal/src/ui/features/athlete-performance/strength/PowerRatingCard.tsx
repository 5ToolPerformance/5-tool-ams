// ui/features/athlete-performance/strength/PowerRatingCard.tsx
import { Card, CardBody, Chip } from "@heroui/react";

import type { PowerRating } from "./types";

interface PowerRatingCardProps {
  rating: PowerRating;
}

function formatDelta(delta?: number) {
  if (delta === undefined || delta === null) {
    return "N/A";
  }
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta}`;
}

export function PowerRatingCard({ rating }: PowerRatingCardProps) {
  return (
    <Card shadow="sm">
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Power Rating</p>
            <p className="text-3xl font-semibold">{rating.score}</p>
          </div>
          <Chip size="sm" variant="flat">
            {rating.percentile}% percentile
          </Chip>
        </div>

        <div className="flex items-center justify-between text-sm text-foreground-500">
          <span>30-day delta</span>
          <span className={rating.delta && rating.delta < 0 ? "text-danger" : ""}>
            {formatDelta(rating.delta)} pts
          </span>
        </div>

        {rating.isRollingAverage && (
          <p className="text-xs text-muted-foreground">
            Rolling average applied to reduce noise.
          </p>
        )}
      </CardBody>
    </Card>
  );
}

export type PitchingLessonData = {
  phase: string;
  pitchCount?: number;
  intentPercent?: number;
};

type PitchingReviewProps = {
  data: PitchingLessonData;
};

export function PitchingReview({ data }: PitchingReviewProps) {
  return (
    <div className="space-y-1 text-sm text-foreground-600">
      <p>
        <strong>Phase:</strong> {data.phase}
      </p>

      {data.pitchCount != null && (
        <p>
          <strong>Pitch Count:</strong> {data.pitchCount}
        </p>
      )}

      {data.intentPercent != null && (
        <p>
          <strong>Intent:</strong> {data.intentPercent}%
        </p>
      )}
    </div>
  );
}

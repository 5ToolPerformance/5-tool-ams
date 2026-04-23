// ui/core/PlayerHeaderMeta.tsx
interface AthleteHeaderMetaProps {
  name: string;
  age: number;
  handedness: string;
  roles?: string;
  primaryCoachName?: string | null;
}

export function AthleteHeaderMeta({
  name,
  age,
  handedness,
  roles,
  primaryCoachName,
}: AthleteHeaderMetaProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">{name}</h1>
      <p className="text-sm text-muted-foreground">
        {age} yrs • {handedness}
        {roles ? ` • ${roles}` : null}
      </p>
      {primaryCoachName ? (
        <p className="text-sm text-muted-foreground">
          Primary Coach: {primaryCoachName}
        </p>
      ) : null}
    </div>
  );
}

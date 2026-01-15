// ui/core/PlayerHeaderMeta.tsx
interface AthleteHeaderMetaProps {
  name: string;
  age: number;
  handedness: string;
  roles?: string;
}

export function AthleteHeaderMeta({
  name,
  age,
  handedness,
  roles,
}: AthleteHeaderMetaProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">{name}</h1>
      <p className="text-sm text-muted-foreground">
        {age} yrs • {handedness}
        {roles ? ` • ${roles}` : null}
      </p>
    </div>
  );
}

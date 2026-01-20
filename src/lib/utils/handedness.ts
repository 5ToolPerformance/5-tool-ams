export type HandednessEnum = "left" | "right" | "switch";
export type HandednessAbbrev = "L" | "R" | "S";

export function toHandednessAbbrev(
  value: string | null | undefined
): HandednessAbbrev | null {
  if (!value) return null;

  switch (value) {
    case "left":
      return "L";
    case "right":
      return "R";
    case "switch":
      return "S";
    default:
      return null;
  }
}

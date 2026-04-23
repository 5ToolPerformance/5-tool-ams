import { getInjuryBodyParts } from "@ams/db/queries/injuryTaxonomy/getInjuryBodyParts";
import { getInjuryFocusAreas } from "@ams/db/queries/injuryTaxonomy/getInjuryFocusAreas";

export async function getInjuryTaxonomy(db) {
  const [bodyParts, focusAreas] = await Promise.all([
    getInjuryBodyParts(db),
    getInjuryFocusAreas(db),
  ]);

  return {
    bodyParts,
    focusAreas,
  };
}

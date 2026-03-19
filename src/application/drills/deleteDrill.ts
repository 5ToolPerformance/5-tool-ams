import db from "@/db";
import { DB } from "@/db";
import { deleteDrill as deleteDrillQuery } from "@/db/queries/drills/deleteDrill";
import { getDrillById } from "@/db/queries/drills/getDrillById";
import { removeDrillFile } from "@/db/queries/drills/removeDrillFile";
import { drillTagLinks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteDrill(drillId: string) {
  return db.transaction(async (tx) => {
    const conn = tx as unknown as DB;
    const drill = await getDrillById(drillId, conn);

    if (!drill) {
      throw new Error("Drill not found");
    }

    for (const file of drill.media) {
      await removeDrillFile(drillId, file.fileId, conn);
    }

    await conn.delete(drillTagLinks).where(eq(drillTagLinks.drillId, drillId));

    const deleted = await deleteDrillQuery(drillId, conn);

    if (!deleted) {
      throw new Error("Drill not found");
    }

    return { id: deleted.id };
  });
}

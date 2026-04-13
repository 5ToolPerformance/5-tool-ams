import { eq, inArray } from "drizzle-orm";

import db from "@/db";
import {
  evaluationBlast,
  evaluationHittrax,
  evaluationsStrength,
  hittraxEvent,
  performanceSession,
} from "@/db/schema";

import {
  buildPlayerPerformanceData,
  type HittraxEventRow,
} from "./getPlayerPerformanceData.mapper";
import type { PlayerPerformanceData } from "./getPlayerPerformanceData.types";

export async function getPlayerPerformanceData(
  playerId: string
): Promise<PlayerPerformanceData> {
  const [strengthRows, hittraxRows, blastRows] = await Promise.all([
    db
      .select({
        sessionId: evaluationsStrength.performanceSessionId,
        evaluationId: evaluationsStrength.evaluationId,
        recordedAt: evaluationsStrength.recordedAt,
        status: performanceSession.status,
        notes: evaluationsStrength.notes,
        powerRating: evaluationsStrength.powerRating,
        rotation: evaluationsStrength.rotation,
        lowerBodyStrength: evaluationsStrength.lowerBodyStrength,
        upperBodyStrength: evaluationsStrength.upperBodyStrength,
      })
      .from(evaluationsStrength)
      .innerJoin(
        performanceSession,
        eq(performanceSession.id, evaluationsStrength.performanceSessionId)
      )
      .where(eq(evaluationsStrength.playerId, playerId)),
    db
      .select({
        sessionId: evaluationHittrax.performanceSessionId,
        evaluationId: evaluationHittrax.evaluationId,
        recordedAt: evaluationHittrax.recordedAt,
        status: performanceSession.status,
        notes: evaluationHittrax.notes,
        exitVelocityMax: evaluationHittrax.exitVelocityMax,
        exitVelocityAvg: evaluationHittrax.exitVelocityAvg,
        hardHitPercent: evaluationHittrax.hardHitPercent,
        launchAngleAvg: evaluationHittrax.launchAngleAvg,
        lineDriveAvg: evaluationHittrax.lineDriveAvg,
      })
      .from(evaluationHittrax)
      .innerJoin(
        performanceSession,
        eq(performanceSession.id, evaluationHittrax.performanceSessionId)
      )
      .where(eq(evaluationHittrax.playerId, playerId)),
    db
      .select({
        sessionId: evaluationBlast.performanceSessionId,
        evaluationId: evaluationBlast.evaluationId,
        recordedAt: evaluationBlast.recordedAt,
        status: performanceSession.status,
        notes: evaluationBlast.notes,
        batSpeedMax: evaluationBlast.batSpeedMax,
        batSpeedAvg: evaluationBlast.batSpeedAvg,
        rotAccMax: evaluationBlast.rotAccMax,
        rotAccAvg: evaluationBlast.rotAccAvg,
        onPlanePercent: evaluationBlast.onPlanePercent,
        attackAngleAvg: evaluationBlast.attackAngleAvg,
        earlyConnAvg: evaluationBlast.earlyConnAvg,
        connAtImpactAvg: evaluationBlast.connAtImpactAvg,
        verticalBatAngleAvg: evaluationBlast.verticalBatAngleAvg,
        timeToContactAvg: evaluationBlast.timeToContactAvg,
        handSpeedMax: evaluationBlast.handSpeedMax,
        handSpeedAvg: evaluationBlast.handSpeedAvg,
      })
      .from(evaluationBlast)
      .innerJoin(
        performanceSession,
        eq(performanceSession.id, evaluationBlast.performanceSessionId)
      )
      .where(eq(evaluationBlast.playerId, playerId)),
  ]);

  const hittraxSessionIds = hittraxRows.map((row) => row.sessionId);
  const hittraxEvents =
    hittraxSessionIds.length > 0
      ? await db
          .select({
            id: hittraxEvent.id,
            sessionId: hittraxEvent.sessionId,
            eventIndex: hittraxEvent.eventIndex,
            atBat: hittraxEvent.atBat,
            pitchVelocity: hittraxEvent.pitchVelocity,
            pitchType: hittraxEvent.pitchType,
            exitVelo: hittraxEvent.exitVelo,
            launchAngle: hittraxEvent.launchAngle,
            distance: hittraxEvent.distance,
            horizontalAngle: hittraxEvent.horizontalAngle,
            contactType: hittraxEvent.contactType,
            result: hittraxEvent.result,
          })
          .from(hittraxEvent)
          .where(inArray(hittraxEvent.sessionId, hittraxSessionIds))
      : [];

  const hittraxEventsBySessionId = hittraxEvents.reduce<
    Record<string, HittraxEventRow[]>
  >((acc, row) => {
    acc[row.sessionId] = acc[row.sessionId] ?? [];
    acc[row.sessionId].push(row);
    return acc;
  }, {});

  return buildPlayerPerformanceData({
    strengthRows: strengthRows.map((row) => ({
      sessionId: row.sessionId,
      evaluationId: row.evaluationId,
      source: "strength",
      recordedAt: row.recordedAt,
      status: row.status,
      notes: row.notes,
      metrics: {
        powerRating: row.powerRating,
        rotation: row.rotation,
        lowerBodyStrength: row.lowerBodyStrength,
        upperBodyStrength: row.upperBodyStrength,
      },
    })),
    hittraxRows: hittraxRows.map((row) => ({
      sessionId: row.sessionId,
      evaluationId: row.evaluationId,
      source: "hittrax",
      recordedAt: row.recordedAt,
      status: row.status,
      notes: row.notes,
      metrics: {
        exitVelocityMax: row.exitVelocityMax,
        exitVelocityAvg: row.exitVelocityAvg,
        hardHitPercent: row.hardHitPercent,
        launchAngleAvg: row.launchAngleAvg,
        lineDriveAvg: row.lineDriveAvg,
      },
    })),
    blastRows: blastRows.map((row) => ({
      sessionId: row.sessionId,
      evaluationId: row.evaluationId,
      source: "blast",
      recordedAt: row.recordedAt,
      status: row.status,
      notes: row.notes,
      metrics: {
        batSpeedMax: row.batSpeedMax,
        batSpeedAvg: row.batSpeedAvg,
        rotAccMax: row.rotAccMax,
        rotAccAvg: row.rotAccAvg,
        onPlanePercent: row.onPlanePercent,
        attackAngleAvg: row.attackAngleAvg,
        earlyConnAvg: row.earlyConnAvg,
        connAtImpactAvg: row.connAtImpactAvg,
        verticalBatAngleAvg: row.verticalBatAngleAvg,
        timeToContactAvg: row.timeToContactAvg,
        handSpeedMax: row.handSpeedMax,
        handSpeedAvg: row.handSpeedAvg,
      },
    })),
    hittraxEventsBySessionId,
  });
}

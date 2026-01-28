"use client";

import Link from "next/link";

import {
  Button,
  Card,
  CardBody,
  CircularProgress,
  Divider,
  User as HeroUser,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { useAllLessons, useUserById } from "@/hooks";
import { LessonWithCoachAndUser } from "@/types/lessons";

type Props = {
  adminId: string;
};

export default function AdminDashboard({ adminId }: Props) {
  const {
    data: admin,
    isLoading: adminLoading,
    error: adminError,
  } = useUserById(adminId);

  const {
    data: lessons,
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useAllLessons();

  if (adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (adminError) {
    return (
      <Card className="mx-auto mt-8 max-w-4xl">
        <CardBody>
          <p className="text-danger">Error: {adminError?.message}</p>
        </CardBody>
      </Card>
    );
  }

  // Prepare leaderboard data when lessons are available
  const allLessons = (lessons || []) as LessonWithCoachAndUser[];

  const coachLeaderboard = (() => {
    const map = new Map<
      string,
      { id: string; name: string | null; image?: string | null; count: number }
    >();
    for (const item of allLessons) {
      const id = item.coach.id as string;
      const name = item.coach.name ?? "Unknown Coach";
      const image = item.coach.image ?? null;
      const entry = map.get(id) || { id, name, image, count: 0 };
      entry.count += 1;
      map.set(id, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  })();

  const playerLeaderboard = (() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const item of allLessons) {
      const id = item.player.id as string;
      const first = item.player.firstName ?? "Unknown";
      const last = item.player.lastName ?? "Player";
      const name = `${first} ${last}`.trim();
      const entry = map.get(id) || { id, name, count: 0 };
      entry.count += 1;
      map.set(id, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  })();

  return (
    <div className="space-y-8">
      {/* Header: Logged-in admin + actions */}
      <Card>
        <CardBody>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-small text-default-500">
                Overview and management
              </p>
            </div>
            <div className="flex items-center gap-3">
              <HeroUser
                name={admin?.name || "Admin"}
                description={admin?.email}
                avatarProps={{
                  showFallback: !admin?.image,
                  src: admin?.image || "",
                }}
              />
              <Divider orientation="vertical" className="h-8" />
              <Button
                color="primary"
                variant="solid"
                onPress={() => console.log("New Player action")}
              >
                New Player
              </Button>
              <Button
                color="secondary"
                variant="flat"
                onPress={() => console.log("Schedule Lesson action")}
              >
                Schedule Lesson
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="mb-3 text-lg font-semibold">
              Top Coaches by Lessons
            </h2>
            {lessonsLoading ? (
              <div className="flex justify-center py-6">
                <CircularProgress size="sm" />
              </div>
            ) : lessonsError ? (
              <p className="text-danger">Error: {lessonsError?.message}</p>
            ) : (
              <Table aria-label="Coaches leaderboard">
                <TableHeader>
                  <TableColumn>COACH</TableColumn>
                  <TableColumn className="text-right">LESSONS</TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={
                    coachLeaderboard.length === 0 ? "No data" : undefined
                  }
                >
                  {coachLeaderboard.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <a href={`/coaches/${c.id}`}>
                            <HeroUser
                              name={c.name || "Unknown Coach"}
                              description={c.id}
                              avatarProps={{
                                showFallback: !c.image,
                                src: c.image || undefined,
                              }}
                            />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {c.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="mb-3 text-lg font-semibold">
              Top Players by Lessons
            </h2>
            {lessonsLoading ? (
              <div className="flex justify-center py-6">
                <CircularProgress size="sm" />
              </div>
            ) : lessonsError ? (
              <p className="text-danger">Error: {lessonsError?.message}</p>
            ) : (
              <Table aria-label="Players leaderboard">
                <TableHeader>
                  <TableColumn>PLAYER</TableColumn>
                  <TableColumn className="text-right">LESSONS</TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={
                    playerLeaderboard.length === 0 ? "No data" : undefined
                  }
                >
                  {playerLeaderboard.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Link href={`/players/${p.id}/training`}>{p.name}</Link>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {p.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>

      {/* All Lessons */}
      <Card>
        <CardBody>
          <h2 className="mb-3 text-lg font-semibold">All Lessons</h2>
          {lessonsLoading ? (
            <div className="flex justify-center py-6">
              <CircularProgress size="sm" />
            </div>
          ) : lessonsError ? (
            <p className="text-danger">Error: {lessonsError?.message}</p>
          ) : (
            <Table aria-label="All lessons table">
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>COACH</TableColumn>
                <TableColumn>PLAYER</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={
                  allLessons.length === 0 ? "No lessons" : undefined
                }
              >
                {allLessons.map((l) => {
                  const dateStr = l.lesson.lessonDate
                    ? new Date(
                        l.lesson.lessonDate as unknown as string
                      ).toLocaleDateString()
                    : "";
                  const coachName = l.coach.name ?? "Unknown Coach";
                  const playerName =
                    `${l.player.firstName ?? "Unknown"} ${l.player.lastName ?? "Player"}`.trim();
                  const type = (l.lesson.lessonType as string) || "-";
                  return (
                    <TableRow key={l.lesson.id}>
                      <TableCell>{dateStr}</TableCell>
                      <TableCell className="capitalize">{type}</TableCell>
                      <TableCell>{coachName}</TableCell>
                      <TableCell>{playerName}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

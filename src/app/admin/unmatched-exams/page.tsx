"use client";

import { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { AlertCircle, FileText, Search, TrendingUp, Users } from "lucide-react";

import { useUnmatchedPlayers } from "@/hooks";

export default function UnmatchedPlayersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { players, error, isLoading } = useUnmatchedPlayers();

  console.log(players);

  // Filter players based on search
  const filteredPlayers = players?.filter((player: any) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName =
      `${player.externalFirstName} ${player.externalLastName}`.toLowerCase();
    const email = player.externalEmail?.toLowerCase() || "";

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      player.externalPlayerId.includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-danger">
          <CardBody>
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-danger" />
              <div>
                <h3 className="mb-1 text-lg font-semibold text-danger">
                  Error
                </h3>
                <p className="text-sm text-default-600">
                  Failed to load unmatched players: {error.message}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Unmatched ArmCare Players</h1>
        <p className="text-default-600">
          Unique players from ArmCare with pending unmatched exams
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-default-600">
                      Total Unmatched Exams
                    </p>
                    <p className="text-2xl font-bold">{players?.length || 0}</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-default-600">
                      Unique Players
                    </p>
                    <p className="text-2xl font-bold">{players?.length || 0}</p>
                  </div>
                  <div className="rounded-lg bg-success/10 p-3">
                    <Users className="h-5 w-5 text-success" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-default-600">
                      Avg Exams per Player
                    </p>
                    <p className="text-2xl font-bold">{players?.length || 0}</p>
                  </div>
                  <div className="rounded-lg bg-warning/10 p-3">
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardBody>
              <Input
                placeholder="Search by name, email, or ArmCare ID..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={<Search className="h-4 w-4 text-default-400" />}
                isClearable
                onClear={() => setSearchTerm("")}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-12",
                }}
              />
            </CardBody>
          </Card>

          {/* Players Table */}
          <Card>
            <CardHeader className="flex flex-col items-start px-6 pb-0">
              <h2 className="text-xl font-semibold">
                Players ({filteredPlayers?.length || 0})
              </h2>
              <p className="text-sm text-default-500">
                Each player may have multiple unmatched exams
              </p>
            </CardHeader>
            <CardBody className="px-0 pb-0">
              <Table
                aria-label="Unmatched players table"
                classNames={{
                  wrapper: "shadow-none",
                }}
              >
                <TableHeader>
                  <TableColumn>PLAYER NAME</TableColumn>
                  <TableColumn>ARMCARE ID</TableColumn>
                  <TableColumn>EMAIL</TableColumn>
                  <TableColumn align="center">EXAM COUNT</TableColumn>
                  <TableColumn>EXAM TYPES</TableColumn>
                  <TableColumn>DATE RANGE</TableColumn>
                  <TableColumn align="end">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={
                    searchTerm
                      ? "No players match your search"
                      : "No unmatched players found"
                  }
                >
                  {filteredPlayers?.map((player: any) => (
                    <TableRow key={player.externalPlayerId}>
                      <TableCell>
                        <span className="font-medium">
                          {player.externalFirstName} {player.externalLastName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-default-100 px-2 py-1 text-xs">
                          {player.externalPlayerId}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-default-500">
                          {player.externalEmail || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Chip size="sm" variant="flat" color="default">
                            {player.examCount}
                          </Chip>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {player.examTypes.map((type: string) => (
                            <Chip
                              key={type}
                              size="sm"
                              variant="bordered"
                              className="text-xs"
                            >
                              {type}
                            </Chip>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-default-500">
                          {player.earliestExamDate === player.latestExamDate ? (
                            <span>{player.latestExamDate}</span>
                          ) : (
                            <span>
                              {player.earliestExamDate} →{" "}
                              {player.latestExamDate}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button size="sm" variant="flat" color="primary">
                            Link Player
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) || []}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}

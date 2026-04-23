"use client";

import { useMemo, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Link2, Search } from "lucide-react";

import { useUnmatchedHawkinAthletes } from "@/hooks/hawkin/useUnmatchedHawkinAthletes";
import { ExternalLinkPlayerDialog } from "@/ui/features/external-systems/ExternalLinkPlayerDialog";

type HawkinUnlinkedAthlete = {
  athleteId: string;
  athleteName: string | null;
  lastSeenAt: string;
  rowCount: number;
};

export default function HawkinPlayerMatchingPage() {
  const { athletes, isLoading, error, refresh } = useUnmatchedHawkinAthletes();

  const [search, setSearch] = useState<string>("");
  const [selectedAthlete, setSelectedAthlete] =
    useState<HawkinUnlinkedAthlete | null>(null);

  const filteredAthletes = useMemo(() => {
    if (!athletes) return [];
    const q = search.toLowerCase();

    return athletes.filter(
      (athlete) =>
        athlete.athleteId.toLowerCase().includes(q) ||
        athlete.athleteName?.toLowerCase().includes(q)
    );
  }, [athletes, search]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-danger">
          <CardBody>Failed to load Hawkin athletes.</CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Unlinked Hawkin Athletes</h1>
        <p className="text-default-600">
          Hawkin athletes with data in the system that are not yet linked to
          internal players.
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardBody>
          <Input
            placeholder="Search by athlete name or ID…"
            value={search}
            onValueChange={setSearch}
            startContent={<Search className="h-4 w-4 text-default-400" />}
            isClearable
            onClear={() => setSearch("")}
          />
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            Athletes ({filteredAthletes.length})
          </h2>
        </CardHeader>
        <CardBody className="px-0">
          <Table aria-label="Hawkin athletes table">
            <TableHeader>
              <TableColumn>ATHLETE NAME</TableColumn>
              <TableColumn>ATHLETE ID</TableColumn>
              <TableColumn align="center">ROWS</TableColumn>
              <TableColumn>LAST SEEN</TableColumn>
              <TableColumn align="end">ACTIONS</TableColumn>
            </TableHeader>

            <TableBody emptyContent="No unlinked athletes found">
              {filteredAthletes.map((athlete) => (
                <TableRow key={athlete.athleteId}>
                  <TableCell>{athlete.athleteName ?? "—"}</TableCell>

                  <TableCell>
                    <code className="rounded bg-default-100 px-2 py-1 text-xs">
                      {athlete.athleteId}
                    </code>
                  </TableCell>

                  <TableCell align="center">{athlete.rowCount}</TableCell>

                  <TableCell>
                    {new Date(athlete.lastSeenAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<Link2 size={14} />}
                        onPress={() => setSelectedAthlete(athlete)}
                      >
                        Link Player
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* ✅ SYSTEM-AGNOSTIC LINK DIALOG */}
      <ExternalLinkPlayerDialog
        isOpen={selectedAthlete !== null}
        onClose={() => setSelectedAthlete(null)}
        onSuccess={() => {
          setSelectedAthlete(null);
          refresh();
        }}
        externalSystem="hawkin"
        externalAthlete={
          selectedAthlete
            ? {
                externalId: selectedAthlete.athleteId,
                displayName: selectedAthlete.athleteName,
              }
            : null
        }
      />
    </div>
  );
}

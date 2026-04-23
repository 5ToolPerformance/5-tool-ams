"use client";

import { useMemo, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import useSWR from "swr";

import { usePlayers } from "@/hooks";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ClientInviteListItem = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  relationshipType: "parent" | "guardian" | "self" | "other";
  status: "pending" | "accepted" | "expired" | "revoked";
  expiresAt: string;
  createdOn: string;
  playerNames: string[];
};

export function ClientInvitesAdminPageClient() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relationshipType, setRelationshipType] = useState("parent");
  const [playerIds, setPlayerIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { players, isLoading: playersLoading } = usePlayers();
  const { data, mutate, isLoading } = useSWR("/api/admin/client-invites", fetcher);

  const invites = useMemo(
    () => ((data?.data ?? []) as ClientInviteListItem[]),
    [data?.data]
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/admin/client-invites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        relationshipType,
        playerIds,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setMessage(body?.error ?? "Failed to create client invite");
      return;
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setRelationshipType("parent");
    setPlayerIds([]);
    setMessage("Client invite sent.");
    mutate();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Client Invites</h1>
        <p className="text-sm opacity-80">
          Invite parents, guardians, or self-access users into the client portal.
        </p>
      </div>

      <Card>
        <CardBody className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Recipient email"
                type="email"
                value={email}
                onValueChange={setEmail}
                isRequired
              />
              <Select
                label="Relationship"
                selectedKeys={[relationshipType]}
                onSelectionChange={(keys) =>
                  setRelationshipType(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="parent">Parent</SelectItem>
                <SelectItem key="guardian">Guardian</SelectItem>
                <SelectItem key="self">Self</SelectItem>
                <SelectItem key="other">Other</SelectItem>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="First name"
                value={firstName}
                onValueChange={setFirstName}
              />
              <Input
                label="Last name"
                value={lastName}
                onValueChange={setLastName}
              />
            </div>

            <CheckboxGroup
              label="Linked players"
              value={playerIds}
              onValueChange={(value) => setPlayerIds(value as string[])}
            >
              <div className="grid gap-2 md:grid-cols-2">
                {playersLoading ? (
                  <p className="text-sm text-default-500">Loading players...</p>
                ) : (
                  players.map((player: any) => (
                    <Checkbox key={player.id} value={player.id}>
                      {player.firstName} {player.lastName}
                    </Checkbox>
                  ))
                )}
              </div>
            </CheckboxGroup>

            <Button
              type="submit"
              color="primary"
              isLoading={saving}
              isDisabled={!email || playerIds.length === 0}
            >
              Send invite
            </Button>

            {message ? <p className="text-sm">{message}</p> : null}
          </form>
        </CardBody>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent invites</h2>
        {isLoading ? (
          <p className="text-sm text-default-500">Loading invites...</p>
        ) : invites.length === 0 ? (
          <p className="text-sm text-default-500">No client invites yet.</p>
        ) : (
          <div className="grid gap-3">
            {invites.map((invite) => (
              <Card key={invite.id}>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-default-500 capitalize">
                        {invite.relationshipType}
                      </p>
                    </div>
                    <Chip
                      color={invite.status === "accepted" ? "success" : "primary"}
                      variant="flat"
                    >
                      {invite.status}
                    </Chip>
                  </div>
                  <p className="text-sm text-default-500">
                    Players: {invite.playerNames.join(", ")}
                  </p>
                  <p className="text-xs text-default-400">
                    Created {new Date(invite.createdOn).toLocaleDateString()} • Expires{" "}
                    {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


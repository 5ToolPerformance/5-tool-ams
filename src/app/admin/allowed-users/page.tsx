"use client";

import { useState } from "react";

import { Button, Input, Select, SelectItem } from "@heroui/react";

import { usePlayers } from "@/hooks";

export default function AllowedUsersAdminPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("coach");
  const [status, setStatus] = useState<"active" | "invited" | "revoked">(
    "active"
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [linkEmail, setLinkEmail] = useState("");
  const [linkPlayerId, setLinkPlayerId] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkMessage, setLinkMessage] = useState<string | null>(null);
  const { players } = usePlayers();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/admin/allowed-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        provider: "google",
        role,
        status,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data?.error ?? "Failed to add allowed user");
      return;
    }

    setEmail("");
    setMessage("Allowed user added.");
  }

  async function onLinkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLinking(true);
    setLinkMessage(null);

    const res = await fetch("/api/admin/player-account-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: linkPlayerId,
        email: linkEmail,
        provider: "google",
      }),
    });

    setLinking(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLinkMessage(data?.error ?? "Failed to link player account");
      return;
    }

    setLinkEmail("");
    setLinkPlayerId("");
    setLinkMessage("Player account linked.");
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Allowed Users</h1>
        <p className="text-sm opacity-80">
          Add Google users who are allowed to sign in.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Google email"
          value={email}
          onValueChange={setEmail}
          type="email"
          isRequired
        />

        <Select
          label="Role"
          selectedKeys={[role]}
          onSelectionChange={(keys) => setRole(Array.from(keys)[0] as string)}
        >
          <SelectItem key="player">Player</SelectItem>
          <SelectItem key="coach">Coach</SelectItem>
          <SelectItem key="admin">Admin</SelectItem>
        </Select>

        <Select
          label="Status"
          selectedKeys={[status]}
          onSelectionChange={(keys) =>
            setStatus(Array.from(keys)[0] as "active" | "invited" | "revoked")
          }
        >
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="invited">Invited</SelectItem>
          <SelectItem key="revoked">Revoked</SelectItem>
        </Select>

        <Button type="submit" isLoading={saving} color="primary">
          Add Allowed User
        </Button>

        {message && <p className="text-sm">{message}</p>}
      </form>

      <div className="border-t border-default-200 pt-4">
        <h2 className="mb-2 text-lg font-semibold">Link Email To Player</h2>
        <p className="mb-4 text-sm opacity-80">
          Assign an approved Google email to a player profile.
        </p>
        <form onSubmit={onLinkSubmit} className="space-y-4">
          <Input
            label="Player email"
            value={linkEmail}
            onValueChange={setLinkEmail}
            type="email"
            isRequired
          />
          <Select
            label="Player profile"
            selectedKeys={linkPlayerId ? [linkPlayerId] : []}
            onSelectionChange={(keys) =>
              setLinkPlayerId(Array.from(keys)[0] as string)
            }
            isRequired
          >
            {players.map((player: any) => (
              <SelectItem key={player.id}>
                {player.firstName} {player.lastName}
              </SelectItem>
            ))}
          </Select>
          <Button
            type="submit"
            isLoading={linking}
            color="primary"
            isDisabled={!linkEmail || !linkPlayerId}
          >
            Link Player Email
          </Button>
          {linkMessage && <p className="text-sm">{linkMessage}</p>}
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

import { Button, Input, Select, SelectItem } from "@heroui/react";

export default function AllowedUsersAdminPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("coach");
  const [status, setStatus] = useState<"active" | "invited" | "revoked">(
    "active"
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    </div>
  );
}

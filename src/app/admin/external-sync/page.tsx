"use client";

import { useState } from "react";

export default function ExternalSyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/external-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: "armcare" }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-2xl font-bold">ArmCare Sync</h1>

      <button
        onClick={handleSync}
        disabled={syncing}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {syncing ? "Syncing..." : "Trigger Sync"}
      </button>

      {result && (
        <div className="mt-6 rounded border p-4">
          <pre className="overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

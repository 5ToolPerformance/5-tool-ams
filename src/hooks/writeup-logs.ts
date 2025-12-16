import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePlayerWriteups(playerId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/players/${playerId}/writeup-log`,
    fetcher
  );

  const addWriteup = async (writeupData: {
    writeupType: "mid_package" | "end_package" | "end_of_year";
    writeupDate: string;
    notes?: string;
  }) => {
    const response = await fetch(`/api/players/${playerId}/writeup-log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(writeupData),
    });

    if (!response.ok) {
      throw new Error("Failed to add writeup");
    }

    await mutate(); // Refresh the list
    return response.json();
  };

  const getLatestWriteupDate = (): string | null => {
    if (!data || data.length === 0) return null;

    // Data is already sorted by date DESC from repository
    return data[0].writeupDate;
  };

  return {
    writeups: data?.data || [],
    isLoading,
    error,
    addWriteup,
    getLatestWriteupDate,
  };
}

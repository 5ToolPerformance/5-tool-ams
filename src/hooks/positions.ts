import useSWR from "swr";

interface PositionOption {
  id: string;
  code: string;
  name: string;
  group: string;
}

async function fetcher(url: string): Promise<PositionOption[]> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch positions");
  }
  return res.json();
}

export function useAllPositions() {
  const { data, error, isLoading, mutate } = useSWR("/api/positions", fetcher);

  return {
    positions: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

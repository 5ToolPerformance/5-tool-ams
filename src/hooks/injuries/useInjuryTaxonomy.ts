import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useInjuryTaxonomy() {
  const { data, error, isLoading } = useSWR("/api/injury-taxonomy", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000, // 1 hour
  });

  return {
    bodyParts: data?.bodyParts ?? [],
    focusAreas: data?.focusAreas ?? [],
    isLoading,
    error,
  };
}

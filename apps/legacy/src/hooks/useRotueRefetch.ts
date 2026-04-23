"use client";

import { useRouter } from "next/navigation";

export function useRouteRefetch() {
  const router = useRouter();
  return () => router.refresh();
}

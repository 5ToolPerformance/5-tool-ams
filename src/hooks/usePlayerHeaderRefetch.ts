"use client";

import { useRouter } from "next/navigation";

export function usePlayerHeaderRefetch() {
  const router = useRouter();

  return () => {
    router.refresh();
  };
}

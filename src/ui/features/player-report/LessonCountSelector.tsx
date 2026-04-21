"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Select, SelectItem } from "@heroui/react";

const OPTIONS = [5, 10, 20] as const;

type Props = {
  count: number;
  fullWidth?: boolean;
};

export default function LessonCountSelector({
  count,
  fullWidth = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const next = new URLSearchParams(searchParams?.toString());
    next.set("count", value);
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <Select
      aria-label="Lesson range"
      placeholder="Select range"
      label="Range"
      size="sm"
      selectedKeys={new Set([String(count)])}
      onSelectionChange={(keys) => {
        const [first] = Array.from(keys);
        if (first != null) handleChange(String(first));
      }}
      className={fullWidth ? "w-full" : "max-w-[140px]"}
    >
      {OPTIONS.map((opt) => (
        <SelectItem key={String(opt)}>{opt}</SelectItem>
      ))}
    </Select>
  );
}

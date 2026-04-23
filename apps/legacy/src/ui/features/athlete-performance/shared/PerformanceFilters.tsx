"use client";

import { useEffect, useMemo, useState } from "react";

import { Select, SelectItem } from "@heroui/react";

export type PerformanceFilterOption = {
  value: string;
  label: string;
};

export type PerformanceFilterConfig = {
  id: string;
  label: string;
  options: PerformanceFilterOption[];
  placeholder?: string;
};

interface PerformanceFiltersProps {
  filters: PerformanceFilterConfig[];
  values?: Record<string, string>;
  onChange?: (values: Record<string, string>) => void;
}

export function PerformanceFilters({
  filters,
  values,
  onChange,
}: PerformanceFiltersProps) {
  const initialValues = useMemo(() => values ?? {}, [values]);
  const [selectedValues, setSelectedValues] =
    useState<Record<string, string>>(initialValues);

  useEffect(() => {
    if (!values) {
      return;
    }
    setSelectedValues(values);
  }, [values]);

  if (filters.length === 0) {
    return null;
  }

  function handleSelection(filterId: string, value: string) {
    const nextValues = { ...selectedValues, [filterId]: value };
    setSelectedValues(nextValues);
    onChange?.(nextValues);
  }

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <Select
          key={filter.id}
          label={filter.label}
          placeholder={filter.placeholder}
          selectedKeys={
            selectedValues[filter.id] ? [selectedValues[filter.id]] : []
          }
          onSelectionChange={(keys) =>
            handleSelection(filter.id, String([...keys][0] ?? ""))
          }
          className="min-w-[12rem]"
        >
          {filter.options.map((option) => (
            <SelectItem key={option.value} textValue={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      ))}
    </div>
  );
}

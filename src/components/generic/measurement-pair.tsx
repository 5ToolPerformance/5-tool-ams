import React from "react";

import { Input } from "@heroui/react";

interface MeasurementPairProps {
  leftValue: number | undefined;
  rightValue: number | undefined;
  onLeftChange: (value: number | undefined) => void;
  onRightChange: (value: number | undefined) => void;
  onLeftBlur?: () => void;
  onRightBlur?: () => void;
  label: string;
  unit?: string;
  placeholder?: string;
  className?: string;
  inputProps?: {
    variant?: "flat" | "bordered" | "faded" | "underlined";
    size?: "sm" | "md" | "lg";
    radius?: "none" | "sm" | "md" | "lg" | "full";
  };
}

export const MeasurementPair: React.FC<MeasurementPairProps> = ({
  leftValue,
  rightValue,
  onLeftChange,
  onRightChange,
  onLeftBlur,
  onRightBlur,
  label,
  unit = "°",
  placeholder = "0",
  className = "",
  inputProps = {},
}) => {
  const { variant = "bordered", size = "md", radius = "md" } = inputProps;

  const baseInputClasses = {
    input: "text-right",
    inputWrapper: "hover:border-primary-300 focus-within:border-primary-500",
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <Input
        type="number"
        label={`${label} (Left)`}
        placeholder={placeholder}
        endContent={<span className="text-small text-default-400">{unit}</span>}
        value={leftValue?.toString() || ""}
        onChange={(e) => {
          const value = e.target.value;
          onLeftChange(value === "" ? undefined : Number(value));
        }}
        onBlur={onLeftBlur}
        variant={variant}
        size={size}
        radius={radius}
        classNames={baseInputClasses}
      />

      <Input
        type="number"
        label={`${label} (Right)`}
        placeholder={placeholder}
        endContent={<span className="text-small text-default-400">{unit}</span>}
        value={rightValue?.toString() || ""}
        onChange={(e) => {
          const value = e.target.value;
          onRightChange(value === "" ? undefined : Number(value));
        }}
        onBlur={onRightBlur}
        variant={variant}
        size={size}
        radius={radius}
        classNames={baseInputClasses}
      />
    </div>
  );
};

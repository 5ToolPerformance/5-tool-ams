// components/form/FormMeasurementPair.tsx
import { Input } from "@heroui/react";
import { ReactFormApi } from "@tanstack/react-form";

interface FormMeasurementPairProps<T extends Record<string, any>> {
  form: ReactFormApi<T>;
  leftFieldName: keyof T;
  rightFieldName: keyof T;
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

export const FormMeasurementPair = <T extends Record<string, any>>({
  form,
  leftFieldName,
  rightFieldName,
  label,
  unit = "°",
  placeholder = "0",
  className = "",
  inputProps = {},
}: FormMeasurementPairProps<T>) => {
  const { variant = "bordered", size = "md", radius = "md" } = inputProps;

  const baseInputClasses = {
    input: "text-right",
    inputWrapper: "hover:border-primary-300 focus-within:border-primary-500",
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <form.Field name={leftFieldName}>
        {(field) => (
          <Input
            type="number"
            label={`${label} (Left)`}
            placeholder={placeholder}
            endContent={
              <span className="text-small text-default-400">{unit}</span>
            }
            value={field.state.value?.toString() || ""}
            onChange={(e) => {
              const value = e.target.value;
              field.handleChange(value === "" ? undefined : Number(value));
            }}
            onBlur={field.handleBlur}
            variant={variant}
            size={size}
            radius={radius}
            classNames={baseInputClasses}
          />
        )}
      </form.Field>

      <form.Field name={rightFieldName}>
        {(field) => (
          <Input
            type="number"
            label={`${label} (Right)`}
            placeholder={placeholder}
            endContent={
              <span className="text-small text-default-400">{unit}</span>
            }
            value={field.state.value?.toString() || ""}
            onChange={(e) => {
              const value = e.target.value;
              field.handleChange(value === "" ? undefined : Number(value));
            }}
            onBlur={field.handleBlur}
            variant={variant}
            size={size}
            radius={radius}
            classNames={baseInputClasses}
          />
        )}
      </form.Field>
    </div>
  );
};

import React from "react";

import { Input } from "@heroui/react";

type DecimalNumberInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type" | "inputMode"
> & {
  value?: number | null | undefined;
  onChangeNumber: (value: number | undefined) => void;
};

const DecimalNumberInput: React.FC<DecimalNumberInputProps> = ({
  value,
  onChangeNumber,
  onBlur,
  ...rest
}) => {
  const [text, setText] = React.useState<string>("");
  const [focused, setFocused] = React.useState<boolean>(false);

  const displayValue =
    focused || text !== "" ? text : value != null ? String(value) : "";

  const commit = (raw: string) => {
    const n = parseFloat(raw);
    if (Number.isFinite(n)) {
      onChangeNumber(n);
    } else {
      onChangeNumber(undefined);
    }
  };

  return (
    <Input
      {...rest}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onFocus={() => {
        setFocused(true);
        // Initialize edit buffer from current numeric value on first focus
        if (text === "") {
          setText(value != null ? String(value) : "");
        }
      }}
      onChange={(e) => {
        const v = e.target.value;
        // Allow partial decimals and a leading minus
        if (/^-?\d*(?:\.)?\d*$/.test(v)) {
          setText(v);
          // If it's a complete number (not just "-", ".", or ending with '.') commit live
          if (v !== "" && v !== "-" && v !== "." && !v.endsWith(".")) {
            commit(v);
          }
        }
      }}
      onBlur={(e) => {
        // On blur, always attempt to commit, even if partial
        if (text === "-" || text === "." || text === "" || text === "-.") {
          onChangeNumber(undefined);
        } else {
          commit(text);
        }
        setFocused(false);
        setText("");
        onBlur?.(e);
      }}
    />
  );
};

export default DecimalNumberInput;

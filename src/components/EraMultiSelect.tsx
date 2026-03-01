import React from "react";
import Select from "react-select";

interface EraOption {
  value: string;
  label: string;
}

interface EraMultiSelectProps {
  options: EraOption[];
  value: EraOption[];
  onChange: (value: EraOption[]) => void;
  disabled?: boolean;
}

export const EraMultiSelect: React.FC<EraMultiSelectProps> = ({
  options,
  value,
  onChange,
  disabled,
}) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={(val) => onChange(val as EraOption[])}
      isDisabled={disabled}
      placeholder="Select Eras..."
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "0.75rem",
          padding: "2px",
          border: "1px solid #e2e8f0",
          fontSize: "0.85rem",
          fontWeight: "700",
          boxShadow: "none",
          minWidth: 180,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "#f472b6"
            : state.isFocused
              ? "#fdf2f8"
              : "white",
          color: state.isSelected ? "white" : "#475569",
          fontSize: "0.85rem",
          fontWeight: "600",
        }),
      }}
    />
  );
};

// src/components/common/RestaurantSelector.tsx
import React from "react";
import Select from "react-select";
import type { StylesConfig, SingleValue } from "react-select";

export interface RestaurantOption {
  value: number;
  label: string;
}

interface RestaurantSelectorProps {
  options: RestaurantOption[];
  value: number | null;
  onChange: (id: number | null) => void;
}

const colourStyles: StylesConfig<RestaurantOption, false> = {
  control: (styles) => ({
    ...styles,
    borderRadius: "9999px", // rounded-full
    padding: "3px 20px",
    backgroundColor: "white",
    borderColor: "#7c3aed", // violet-600
    boxShadow: "none",
    ":hover": { borderColor: "#6d28d9" }, // violet-700
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#7c3aed"
      : isFocused
      ? "rgba(124,58,237,0.1)"
      : undefined,
    color: isSelected ? "white" : "#111827",
    cursor: "pointer",
  }),
};

const RestaurantSelector: React.FC<RestaurantSelectorProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <Select
      id="restaurant-select"
      instanceId="restaurant-select"
      aria-label="Select restaurant"
      options={options}
      value={value ? options.find((opt) => opt.value === value) || null : null}
      onChange={(option: SingleValue<RestaurantOption>) =>
        onChange(option ? option.value : null)
      }
      styles={colourStyles}
      placeholder={
        options.length === 0
          ? "No restaurants available"
          : "Select a restaurant"
      }
    />
  );
};

export default RestaurantSelector;

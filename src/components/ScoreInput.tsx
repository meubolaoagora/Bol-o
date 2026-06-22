"use client";

interface ScoreInputProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function ScoreInput({ value, onChange, disabled = false }: ScoreInputProps) {
  return (
    <input
      type="number"
      min="0"
      max="99"
      value={value === undefined ? "" : value}
      onChange={(e) => {
        if (onChange) {
          const val = parseInt(e.target.value, 10);
          onChange(isNaN(val) ? 0 : val);
        }
      }}
      disabled={disabled}
      className={`score-input ${disabled ? "opacity-75 cursor-not-allowed" : ""}`}
      placeholder="-"
    />
  );
}

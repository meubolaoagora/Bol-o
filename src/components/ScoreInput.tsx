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
      inputMode="numeric"
      pattern="[0-9]*"
      min="0"
      max="99"
      value={value === undefined ? "" : value}
      onChange={(e) => {
        if (onChange) {
          const val = parseInt(e.target.value, 10);
          onChange(isNaN(val) ? 0 : val);
        }
      }}
      onFocus={(e) => e.target.select()}
      disabled={disabled}
      className={`score-input ${disabled ? "opacity-75 cursor-not-allowed" : ""}`}
      placeholder="-"
    />
  );
}

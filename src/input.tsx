import { ChangeEvent } from "react";

export default function Input({
  label,
  id,
  type,
  value,
  onChange,
  w = undefined,
  required = false,
  min,
}: {
  label: string;
  id: string;
  type: "text" | "number";
  value: string | number | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  w?: string;
  required?: boolean;
  min?: number;
}) {
  const width = w ? `w-${w}` : "max-w-[150px]";

  const requiredProps = required ? { required } : {};
  const minProps = min ? { min } : {};
  return (
    <div className={`flex flex-col ${width}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        placeholder={label}
        className="border p-2 rounded"
        id={id}
        name={id}
        value={value || ""}
        onChange={onChange}
        {...requiredProps}
        {...minProps}
      />
    </div>
  );
}

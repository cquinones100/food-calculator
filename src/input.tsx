import { ChangeEvent } from "react";

export default function Input({
  label,
  id,
  type,
  value,
  onChange,
  w = undefined,
}: {
  label: string;
  id: string;
  type: "text" | "number";
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  w?: string;
}) {
  const width = w ? `w-${w}` : "max-w-[150px]";
  return (
    <div className={`flex flex-col ${width}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        placeholder={label}
        className="border p-2 rounded"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

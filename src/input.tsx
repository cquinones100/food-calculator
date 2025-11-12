import { ChangeEvent } from "react";

export default function Input({
  label,
  id,
  type,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type: "text" | "number";
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        type={type}
        placeholder={label}
        className="border p-2 rounded max-w-[150px]"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

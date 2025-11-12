import { PropsWithChildren } from "react";

export default function Modal({
  children,
  onClose,
}: PropsWithChildren<{ onClose: () => void }>) {
  return (
    <div className="fixed inset-0 flex flex-col items-center bg-[#242424] bg-opacity-50 z-50 gap-2 p-2">
      <div className="flex justify-end w-full">
        <button className="rounded p-1" onClick={onClose}>
          <span className="text-white p-1 rounded flex text-xs">X</span>
        </button>
      </div>
      {children}
    </div>
  );
}

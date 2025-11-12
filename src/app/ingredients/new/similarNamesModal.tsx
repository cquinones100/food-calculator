import { PropsWithChildren, useState, useEffect } from "react";

function Similarity({
  children,
  onClick,
}: PropsWithChildren<{ onClick?: () => void }>) {
  return (
    <li className="border p-2 rounded w-full text-center" onClick={onClick}>
      {children}
    </li>
  );
}

export default function SimilarNamesModal({
  similarities,
  onContinue,
  onSelect,
}: {
  similarities: string[];
  onContinue: () => void;
  onSelect: (name: string) => void;
}) {
  const [render, setRender] = useState(similarities.length > 0);

  useEffect(() => {
    if (similarities.length === 0) {
      setRender(false);
    } else {
      setRender(true);
    }
  }, [similarities]);

  if (!render) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-gray-900 bg-opacity-50 z-50 gap-2 p-2">
      <div className="flex justify-end w-full">
        <button
          className="rounded p-1"
          onClick={() => {
            setRender(false);
          }}
        >
          <span className="text-white p-1 rounded flex text-xs">X</span>
        </button>
      </div>
      <div className="text-xl flex justify-center w-full">
        <span className="flex items-center text-center">
          Your submission is similar to the following items. Choose one or
          select continue to submit as is.
        </span>
      </div>
      <ul className="flex flex-col w-full gap-2">
        {similarities.map((similarity) => {
          return (
            <Similarity
              key={similarity}
              onClick={() => {
                onSelect(similarity);
              }}
            >
              {similarity}
            </Similarity>
          );
        })}
        <Similarity key="continue" onClick={onContinue}>
          Continue as is
        </Similarity>
      </ul>
    </div>
  );
}

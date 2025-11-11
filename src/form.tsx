"use client";

import saveFood from "./actions/saveFood";
import {
  FormEvent,
  PropsWithChildren,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";

function Input({
  label,
  id,
  type,
}: {
  label: string;
  id: string;
  type: "text" | "number";
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
      />
    </>
  );
}

function Similarity({ children }: PropsWithChildren) {
  return <li className="border p-2 rounded w-full text-center">{children}</li>;
}

function SimilarNamesModal({ similarities }: { similarities: string[] }) {
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
          return <Similarity key={similarity}>{similarity}</Similarity>;
        })}
        <Similarity key="continue">Continue as is</Similarity>
      </ul>
    </div>
  );
}

export default function Form() {
  const initialState = {
    similarities: [],
  };

  async function onSubmit(
    _previousState: { similarities: string[] },
    formData: FormData
  ) {
    const res = await saveFood({
      name: String(formData.get("food-name"))!,
      calories: Number(formData.get("calories")!),
      carbs: Number(formData.get("carbs")!),
      fat: Number(formData.get("fat")!),
      protein: Number(formData.get("protein")!),
      servingSize: Number(formData.get("serving-size")!),
      totalWeight: Number(formData.get("total-weight")!),
      date: new Date(),
    });

    if (res?.error) {
      return {
        similarities: res.similarities,
      };
    } else {
      return initialState;
    }
  }

  const [state, formAction, isPending] = useActionState(onSubmit, initialState);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <>
      <SimilarNamesModal similarities={state.similarities} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-2 justify-center align-middle"
      >
        <Input label="Food Name" id="food-name" type="text" />
        <Input label="Total Weight (g)" id="total-weight" type="number" />
        <Input label="Serving Size (g)" id="serving-size" type="number" />
        <Input label="Calories" id="calories" type="number" />
        <Input label="Fat (g)" id="fat" type="number" />
        <Input label="Carbs (g)" id="carbs" type="number" />
        <Input label="Protein (g)" id="protein" type="number" />
        <input
          disabled={isPending}
          type="submit"
          value="Add Food"
          className="bg-blue-500 text-white p-2 rounded"
        />
      </form>
    </>
  );
}

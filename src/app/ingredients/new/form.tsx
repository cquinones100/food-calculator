"use client";

import { InferAttributes } from "sequelize";
import saveFood from "@/actions/saveFood";
import {
  FormEvent,
  startTransition,
  useActionState,
  useRef,
  useState,
} from "react";
import { Food } from "@/models/food";
import { Entry } from "@/models/entry";
import Input from "@/input";
import SimilarNamesModal from "./similarNamesModal";

export default function Form() {
  const initialState = {
    similarities: [],
  };

  const [pendingFood, setPendingFood] = useState<
    InferAttributes<Food> & Omit<InferAttributes<Entry>, "food" | "foodId">
  >({
    name: "",
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    servingSize: 0,
    totalWeight: 0,
    date: new Date(),
  });

  async function onSubmit(
    _previousState: { similarities: string[] },
    formData: FormData
  ) {
    let name = formData.get("food-name");

    const { calories, carbs, fat, protein, servingSize, totalWeight, date } =
      pendingFood;
    name = name ? String(name) : pendingFood.name;
    const forceSimilarity = formData.get("force-similarity") === "true";

    setPendingFood({
      ...pendingFood,
      name,
    });

    const res = await saveFood(
      {
        name,
        calories,
        carbs,
        fat,
        protein,
        servingSize,
        totalWeight,
        date,
      },
      {
        forceSimilarity,
      }
    );

    if (res?.error) {
      if (res.similarities) {
        return {
          similarities: res.similarities || [],
        };
      } else if (res.food) {
        return {
          existingFood: res.food,
          similarities: res.similarities || [],
        };
      }
    }

    return initialState;
  }

  const [state, formAction, isPending] = useActionState(onSubmit, initialState);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();

    startTransition(() => {
      formAction(formData);
    });
  }

  const formRef = useRef<HTMLFormElement>(null);

  function handleContinue() {
    const formData = new FormData();

    formData.append("forceSimilarity", "true");

    startTransition(() => {
      formAction(formData);
    });
  }

  function handleSelect(name: string) {
    const formData = new FormData();

    formData.append("food-name", name);
    formData.append("force-similarity", "true");

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <>
      <SimilarNamesModal
        similarities={state.similarities}
        onContinue={handleContinue}
        onSelect={handleSelect}
      />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-2 justify-center align-middle"
      >
        <Input
          label="Food Name"
          id="food-name"
          type="text"
          value={pendingFood.name}
          onChange={(e) => {
            setPendingFood({ ...pendingFood, name: e.target.value });
          }}
        />
        <Input
          label="Total Weight (g)"
          id="total-weight"
          type="number"
          value={pendingFood.totalWeight}
          onChange={(e) => {
            setPendingFood({
              ...pendingFood,
              totalWeight: Number(e.target.value),
            });
          }}
        />
        <Input
          label="Serving Size (g)"
          id="serving-size"
          type="number"
          value={pendingFood.servingSize}
          onChange={(e) => {
            setPendingFood({
              ...pendingFood,
              servingSize: Number(e.target.value),
            });
          }}
        />
        <Input
          label="Calories"
          id="calories"
          type="number"
          value={pendingFood.calories}
          onChange={(e) => {
            setPendingFood({
              ...pendingFood,
              calories: Number(e.target.value),
            });
          }}
        />
        <Input
          label="Fat (g)"
          id="fat"
          type="number"
          value={pendingFood.fat}
          onChange={(e) => {
            setPendingFood({ ...pendingFood, fat: Number(e.target.value) });
          }}
        />
        <Input
          label="Carbs (g)"
          id="carbs"
          type="number"
          value={pendingFood.carbs}
          onChange={(e) => {
            setPendingFood({ ...pendingFood, carbs: Number(e.target.value) });
          }}
        />
        <Input
          label="Protein (g)"
          id="protein"
          type="number"
          value={pendingFood.protein}
          onChange={(e) => {
            setPendingFood({ ...pendingFood, protein: Number(e.target.value) });
          }}
        />
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

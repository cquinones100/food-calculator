"use client";

import saveFood from "@/actions/saveFood";
import {
  FormEvent,
  startTransition,
  useActionState,
  useRef,
  useState,
} from "react";
import Input from "@/input";
import SimilarNamesModal from "./similarNamesModal";
import ExistingFoodModal from "./existingFoodModal";
import { Ingredient } from "@/app/IngredientsContext";
import getFoodsByName from "@/actions/getFoodsByName";
import { Food } from "@/database";

function SimilarFood({ food }: { food: Food }) {
  return (
    <div className="border p-2 rounded mb-2 flex justify-between cursor-pointer">
      <div className="flex flex-col">
        <div className="flex justify-end"></div>
        <div className="flex gap-2 justify-between flex-wrap items-center">
          <div className="font-bold text-xl flex-1">{food.name}</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div>Serving Size: {food.servingSize}g</div>
          <div>Calories: {food.calories}</div>
          <div>Fat: {food.fat}g</div>
          <div>Carbs: {food.carbs}g</div>
          <div>Protein: {food.protein}g</div>
        </div>
      </div>
    </div>
  );
}

export type ServingAttributes = {
  totalWeight: number;
};

export default function Form({
  onFoodSubmit,
}: {
  onFoodSubmit: (food: Ingredient) => void;
}) {
  const initialState = {
    similarities: [],
  };

  const [servingAttributes, setServingAttributes] = useState<ServingAttributes>(
    {
      totalWeight: 0,
    }
  );

  const [pendingFood, setPendingFood] = useState<Ingredient>({
    name: "",
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    servingSize: 0,
    totalWeight: 0,
  });

  async function onSubmit(
    _previousState: { similarities: string[] },
    formData: FormData
  ) {
    let name = formData.get("food-name");

    const { calories, carbs, fat, protein, servingSize } = pendingFood;
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
      } else if (res.existingFood) {
        return {
          newFood: res.newFood,
          existingFood: res.existingFood,
          similarities: res.similarities || [],
        };
      }
    }

    setServingAttributes({ totalWeight: 0 });
    setPendingFood({
      name: "",
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
      servingSize: 0,
      totalWeight: 0,
    });
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

  function handleUpdateExisting() {
    alert("We will update existing now");
  }

  const [similarFoods, setSimilarFoods] = useState<Food[]>([]);

  async function findSimilarFood(name: string) {
    setSimilarFoods(await getFoodsByName(name));
  }

  return (
    <>
      <ExistingFoodModal
        food={state.existingFood}
        newFood={state.newFood}
        onClickNew={handleUpdateExisting}
      />
      <SimilarNamesModal
        similarities={state.similarities}
        onContinue={handleContinue}
        onSelect={handleSelect}
      />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 justify-center align-middle w-full"
      >
        <div className="flex w-1/3">
          <Input
            label="Food Name"
            id="food-name"
            type="text"
            value={pendingFood.name}
            onChange={async (e) => {
              setPendingFood({ ...pendingFood, name: e.target.value });
              await findSimilarFood(e.target.value);
            }}
            w="full"
          />
        </div>
        <div className="flex flex-wrap gap-2 align-middle justify-between">
          <Input
            label="Total Weight (g)"
            id="total-weight"
            type="number"
            value={servingAttributes.totalWeight}
            onChange={(e) => {
              setServingAttributes({
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
              setPendingFood({
                ...pendingFood,
                protein: Number(e.target.value),
              });
            }}
          />
        </div>
        {similarFoods.map((food) => {
          return <SimilarFood food={food} key={food.id} />;
        })}
        <div className="flex w-full justify-end">
          <input
            disabled={isPending}
            type="submit"
            value="Add Food"
            className="bg-blue-500 text-white p-2 rounded w-1/3 cursor-pointer"
          />
        </div>
      </form>
    </>
  );
}

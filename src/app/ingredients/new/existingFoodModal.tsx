import updateFood from "@/actions/updateFood";
import Modal from "@/modal";
import { Food } from "@/models/food";
import { redirect } from "next/navigation";
import { useState, useEffect, useActionState, useCallback } from "react";
import { InferAttributes } from "sequelize";

function FoodItem({
  food,
  isNew = false,
  diff,
  onClick,
  disabled,
}: {
  food: InferAttributes<Food>;
  isNew?: boolean;
  diff: Set<"calories" | "fat" | "carbs" | "protein">;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      formAction={onClick}
      className="border p-2 rounded mb-2 w-full flex justify-between"
      disabled={disabled}
    >
      <div className="flex flex-col">
        <div className="flex justify-end"></div>
        <div className="flex gap-2 justify-between flex-wrap items-center">
          <div className="font-bold text-xl flex-1">
            {isNew ? "Updated" : "Existing"}:
          </div>
        </div>
        <div className="flex gap-2 justify-between flex-wrap items-center">
          <div className="font-bold text-xl flex-1">{food.name}</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className={diff.has("calories") ? "text-red-600 font-bold" : ""}>
            Calories: {food.calories}
          </div>
          <div className={diff.has("fat") ? "text-red-600 font-bold" : ""}>
            Fat: {food.fat}g
          </div>
          <div className={diff.has("carbs") ? "text-red-600 font-bold" : ""}>
            Carbs: {food.carbs}g
          </div>
          <div className={diff.has("protein") ? "text-red-600 font-bold" : ""}>
            Protein: {food.protein}g
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ExistingFoodModal({
  food,
  newFood,
}: {
  food: InferAttributes<Food> | undefined;
  newFood: InferAttributes<Food> | undefined;
  onClickNew: () => void;
}) {
  const [foodState, setFoodState] = useState(food);

  useEffect(() => {
    setFoodState(food);
  }, [food]);

  const chooseExisting = useCallback(async () => {
    if (!food) {
      return;
    }

    redirect("/");
  }, [food]);

  const chooseToUpdate = useCallback(async () => {
    if (!food || !newFood) {
      return;
    }

    await updateFood({
      name: food.name,
      calories: newFood.calories,
      carbs: newFood.carbs,
      fat: newFood.fat,
      protein: newFood.protein,
    });

    redirect("/");
  }, [food, newFood]);

  const [chooseExistingState, chooseExistingAction, chooseExistingIsPending] =
    useActionState(chooseExisting, null);

  const [chooseToUpdateState, chooseToUpdateAction, chooseToUpdateIsPending] =
    useActionState(chooseToUpdate, null);

  if (!foodState || !food || !newFood) return null;

  const diff = new Set<"calories" | "fat" | "carbs" | "protein">();

  for (const prop of ["calories", "fat", "carbs", "protein"] as const) {
    if (food[prop] !== newFood[prop]) {
      diff.add(prop);
    }
  }

  const loading = chooseExistingIsPending || chooseToUpdateIsPending;

  return (
    <Modal onClose={() => setFoodState(undefined)}>
      <div className="text-xl flex justify-center w-full">
        <span className="flex items-center text-center">
          A food with this name already exists. Which to keep?
        </span>
      </div>
      <form>
        <FoodItem
          food={food}
          diff={diff}
          onClick={chooseExistingAction}
          disabled={loading}
        />
        <FoodItem
          food={newFood}
          isNew
          diff={diff}
          onClick={chooseToUpdateAction}
          disabled={loading}
        />
      </form>
    </Modal>
  );
}

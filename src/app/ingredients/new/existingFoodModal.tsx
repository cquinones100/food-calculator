import Modal from "@/modal";
import { Food } from "@/models/food";
import { useState, useEffect } from "react";
import { InferAttributes } from "sequelize";

function FoodItem({
  food,
  isNew = false,
  diff,
  onClick,
}: {
  food: InferAttributes<Food>;
  isNew?: boolean;
  diff: Set<"calories" | "fat" | "carbs" | "protein">;
  onClick: () => void;
}) {
  return (
    <div
      className="border p-2 rounded mb-2 w-full flex justify-between"
      onClick={onClick}
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
    </div>
  );
}

export default function ExistingFoodModal({
  food,
  newFood,
  onClickExisting,
  onClickNew,
}: {
  food: InferAttributes<Food> | undefined;
  newFood: InferAttributes<Food>;
  onClickExisting: () => void;
  onClickNew: () => void;
}) {
  const [foodState, setFoodState] = useState(food);

  useEffect(() => {
    setFoodState(food);
  }, [food]);

  if (!foodState || !food) return null;

  const diff = new Set<"calories" | "fat" | "carbs" | "protein">();

  for (const prop of ["calories", "fat", "carbs", "protein"] as const) {
    if (food[prop] !== newFood[prop]) {
      diff.add(prop);
    }
  }

  return (
    <Modal onClose={() => setFoodState(undefined)}>
      <div className="text-xl flex justify-center w-full">
        <span className="flex items-center text-center">
          A food with this name already exists. Which to keep?
        </span>
      </div>
      <FoodItem food={food} diff={diff} onClick={onClickExisting} />
      <FoodItem food={newFood} isNew diff={diff} onClick={onClickNew} />
    </Modal>
  );
}

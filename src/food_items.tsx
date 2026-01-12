import { ServingAttributes } from "./app/ingredients/new/form";
import { Food } from "./models/food";

export type FoodEntry = Food;

function FoodItem({ food }: { food: FoodEntry & ServingAttributes }) {
  return (
    <div className="border p-2 rounded mb-2 w-full flex justify-between">
      <div className="flex flex-col">
        <div className="flex justify-end"></div>
        <div className="flex gap-2 justify-between flex-wrap items-center">
          <div className="font-bold text-xl flex-1">{food.name}</div>
          <div>Total Weight: {food.totalWeight}g</div>
          <button className="rounded p-1">
            <span className="text-white p-1 rounded flex text-xs">X</span>
          </button>
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

export default function FoodItems({
  foods,
}: {
  foods: (FoodEntry & ServingAttributes)[];
}) {
  if (!foods || foods.length === 0) {
    return <p className="mb-4">No foods added yet.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex w-full items-end justify-end"></div>
      {foods.map((food, index) => (
        <FoodItem key={index} food={food} />
      ))}
    </div>
  );
}

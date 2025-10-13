import { useContext } from "react";
import { FoodContext } from "./food_context";

export type Food = {
  name: string;
  totalWeight: number;
  servingSize: number;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
}

function FoodItem({ food, deleteFood }: { food: Food; deleteFood: () => void }) {
  return (
    <div className="border p-2 rounded mb-2 w-full flex justify-between">
      <div className="flex gap-2 justify-between">
        <div className="font-bold text-left">{food.name}</div>
        <div>Total Weight: {food.totalWeight}g</div>
        <div>Serving Size: {food.servingSize}g</div>
        <div>Calories: {food.calories}</div>
        <div>Fat: {food.fat}g</div>
        <div>Carbs: {food.carbs}g</div>
        <div>Protein: {food.protein}g</div>
      </div>
      <button className="bg-red-500 text-white p-1 rounded h-fit" onClick={deleteFood}>X</button>
    </div>
  );
}

export default function FoodItems() {
  const { foods, setFoods } = useContext(FoodContext);

  function resetFoods() {
    setFoods([]);
  }

  function deleteFood(index: number) {
    if (!foods) return;

    const updatedFoods = foods.filter((_, i) => i !== index);
    setFoods(updatedFoods);
  }

  if (!foods || foods.length === 0) {
    return (
      <p className="mb-4">No foods added yet.</p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex w-full items-end justify-end">
        <button className="bg-red-500 text-white p-2 rounded" onClick={resetFoods}>Clear All</button>
      </div>
      {foods.map((food, index) => <FoodItem key={index} food={food} deleteFood={() => deleteFood(index)} />)}
    </div>
  );
}

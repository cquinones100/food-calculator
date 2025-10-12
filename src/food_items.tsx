export type Food = {
  name: string;
  totalWeight: number;
  servingSize: number;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
}

function FoodItem({ food }: { food: Food }) {
  return (
    <div className="border p-2 rounded mb-2 w-full flex justify-between">
      <div className="flex gap-2 justify-between">
        <div className="font-bold text-left">{food.name}</div>
        <div>Serving Size: {food.servingSize}g</div>
        <div>Calories: {food.calories}</div>
        <div>Fat: {food.fat}g</div>
        <div>Carbs: {food.carbs}g</div>
        <div>Protein: {food.protein}g</div>
      </div>
      <button className="bg-red-500 text-white p-1 rounded h-fit">X</button>
    </div>
  );
}

export default function FoodItems({ foods, resetFoods }: { foods: Food[]; resetFoods: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex w-full items-end justify-end">
        <button className="bg-red-500 text-white p-2 rounded" onClick={resetFoods}>Clear All</button>
      </div>
      {foods.map((food, index) => <FoodItem key={index} food={food} />)}
    </div>
  );
}

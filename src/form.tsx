import type { Food } from "./food_items";

export default function Form({ onSubmit }: { onSubmit: (food: Food) => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const newFood: Food = {
      name: form['food-name'].value,
      totalWeight: Number(form['total-weight'].value),
      servingSize: Number(form['serving-size'].value),
      calories: Number(form['calories'].value),
      fat: Number(form['fat'].value),
      carbs: Number(form['carbs'].value),
      protein: Number(form['protein'].value),
    };

    onSubmit(newFood);

    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap justify-end gap-2">
      <label htmlFor="food-name" className="sr-only">Food Name</label>
      <input type="text" placeholder="Food Name" className="border p-2 rounded" id="food-name" />
      <label htmlFor="total-weight" className="sr-only">Total Weight (g)</label>
      <input type="number" placeholder="Total Weight (g)" className="border p-2 rounded" id="total-weight" />
      <label htmlFor="serving-size" className="sr-only">Serving Size (g)</label>
      <input type="number" placeholder="Serving Size (g)" className="border p-2 rounded" id="serving-size" />
      <label htmlFor="calories" className="sr-only">Calories</label>
      <input type="number" placeholder="Calories" className="border p-2 rounded" id="calories" />
      <label htmlFor="fat" className="sr-only">Fat (g)</label>
      <input type="number" placeholder="Fat (g)" className="border p-2 rounded" id="fat" />
      <label htmlFor="carbs" className="sr-only">Carbs (g)</label>
      <input type="number" placeholder="Carbs (g)" className="border p-2 rounded" id="carbs" />
      <label htmlFor="protein" className="sr-only">Protein (g)</label>
      <input type="number" placeholder="Protein (g)" className="border p-2 rounded" id="protein" />
      <input type="submit" value="Add Food" className="bg-blue-500 text-white p-2 rounded" />
    </form>
  );
}
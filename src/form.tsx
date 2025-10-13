import type { Food } from "./food_items";

function Input({ label, id, type }: { label: string; id: string; type: "text" | "number" }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">{label}</label>
      <input type={type} placeholder={label} className="border p-2 rounded" id={id} />
    </>
  )
}

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
      <Input label="Food Name" id="food-name" type="text" />
      <Input label="Total Weight (g)" id="total-weight" type="number" />
      <Input label="Serving Size (g)" id="serving-size" type="number" />
      <Input label="Calories" id="calories" type="number" />
      <Input label="Fat (g)" id="fat" type="number" />
      <Input label="Carbs (g)" id="carbs" type="number" />
      <Input label="Protein (g)" id="protein" type="number" />
      <input type="submit" value="Add Food" className="bg-blue-500 text-white p-2 rounded" />
    </form>
  );
}
import React, { useEffect } from 'react';
import './App.css'
import type { Food } from './food_items';
import FoodItems from './food_items';

function App() {
  const [foods, setFoods] = React.useState<Food[]>();
  const [numServings, setNumServings] = React.useState<number>();

  useEffect(() => {
    if (!foods) {
      const foodsFromStorage = localStorage.getItem('foods');
      if (foodsFromStorage) {
        setFoods(JSON.parse(foodsFromStorage));
      } else {
        setFoods([]);
      }
    }
  }, [foods]);

  function resetFoods() {
    setFoods([]);
    localStorage.setItem('foods', JSON.stringify([]));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!foods) return;

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

    setFoods([...foods, newFood]);
    localStorage.setItem('foods', JSON.stringify([...foods, newFood]));

    form.reset();
  }

  return (
    <div className="flex flex-col items-center p-4 w-full gap-2">
      <h1 className="text-2xl font-bold mb-4">Food Calculator</h1>
      {
        foods && foods.length > 0 ? (
          <FoodItems foods={foods} resetFoods={resetFoods} />
        ) : (
          <p className="mb-4">No foods added yet.</p>
        )
      }
      <div className="flex flex-col items-center gap-3 w-full">
        <label htmlFor="num-servings" className="sr-only">Number of Servings:</label>
        <input
          className="border p-2 rounded"
          placeholder='Num servings'
          type="number"
          id="num-servings"
          value={numServings}
          onChange={(e) => setNumServings(Number(e.target.value))}
          min="1"
        />
      </div>
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
    </div>
  )
}

export default App

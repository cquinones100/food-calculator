import React, { useEffect } from "react";
import "./App.css";
import type { Food } from "./food_items";
import { FoodContext } from "./food_context";
import TotalPerServing from "./total_per_serving";
import FoodItems from "./food_items";
import Form from "./form";

function App() {
  const [foods, setFoods] = React.useState<Food[]>();

  function setFoodsAndSave(foods: Food[]) {
    setFoods(foods);
    localStorage.setItem("foods", JSON.stringify(foods));
  }

  useEffect(() => {
    if (!foods) {
      const foodsFromStorage = localStorage.getItem("foods");

      setFoodsAndSave(foodsFromStorage ? JSON.parse(foodsFromStorage) : []);
    }
  }, [foods]);

  function handleFormSubmit(food: Food) {
    setFoodsAndSave([...(foods || []), food]);
  }

  return (
    <div className="flex flex-col p-4 w-full gap-2 h-[100vh]">
      <h1 className="text-2xl font-bold mb-4">Food Calculator</h1>
      {foods && (
        <div className="flex flex-col items-center justify-center gap-2 flex-grow">
          <FoodContext.Provider value={{ foods, setFoods: setFoodsAndSave }}>
            <TotalPerServing />
            <FoodItems />
          </FoodContext.Provider>
          <Form onSubmit={handleFormSubmit} />
        </div>
      )}
    </div>
  );
}

export default App;

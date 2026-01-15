"use client";

import React, { use, useMemo } from "react";
import { IngredientsContext } from "./app/IngredientsContext";

export default function TotalPerServing() {
  const { ingredients } = use(IngredientsContext);

  const [numServings, setNumServings] = React.useState<number | "">("");

  const perServing = useMemo(() => {
    const defaultValues = { calories: 0, fat: 0, carbs: 0, protein: 0 };

    if (!numServings) {
      return defaultValues;
    }

    return ingredients.reduce((acc, food) => {
      acc.calories +=
        (food.calories / food.servingSize) * (food.totalWeight / numServings);
      acc.fat +=
        (food.fat / food.servingSize) * (food.totalWeight / numServings);
      acc.carbs +=
        (food.carbs / food.servingSize) * (food.totalWeight / numServings);
      acc.protein +=
        (food.protein / food.servingSize) * (food.totalWeight / numServings);

      return acc;
    }, defaultValues);
  }, [ingredients, numServings]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex justify-between gap-3">
          <label htmlFor="num-servings" className="sr-only">
            Number of Servings:
          </label>
          <input
            className="border p-2 rounded"
            placeholder="Num servings"
            type="number"
            id="num-servings"
            value={numServings}
            onChange={(e) => {
              if (!e.target.value) {
                setNumServings("");
                return;
              }
              setNumServings(Number(e.target.value));
            }}
            min="1"
          />
        </div>
      </div>
      <div className="border p-2 rounded w-full mt-4 gap-2">
        <h2 className="text-lg font-bold mb-2">
          Total Per Serving (for {numServings} servings):
        </h2>
        <div className="flex flex-row gap-1 w-full justify-between">
          <div>Calories: {perServing.calories.toFixed(2)}</div>
          <div>Fat: {perServing.fat.toFixed(2)}g</div>
          <div>Carbs: {perServing.carbs.toFixed(2)}g</div>
          <div>Protein: {perServing.protein.toFixed(2)}g</div>
        </div>
      </div>
    </div>
  );
}

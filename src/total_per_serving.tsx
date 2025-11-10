"use client";

import React, { useMemo } from "react";
import { Food } from "./models/food";
import { InferAttributes } from "sequelize";
import { Entry } from "./models/entry";

export default function TotalPerServing({
  foods,
}: {
  foods: (InferAttributes<Food> & InferAttributes<Entry>)[];
}) {
  const [numServings, setNumServings] = React.useState<number | "">("");

  const perServing = useMemo(() => {
    const defaultValues = { calories: 0, fat: 0, carbs: 0, protein: 0 };

    if (!numServings) {
      return defaultValues;
    }

    return foods.reduce((acc, food) => {
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
  }, [foods, numServings]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex justify-between w-full">
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
          <a href="/ingredients/new">
            <button
              value="Add Food"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Food
            </button>
          </a>
        </div>
      </div>
      <div className="border p-2 rounded w-full mt-4 gap-2">
        <h2 className="text-lg font-bold mb-2">
          Total Per Serving (for {numServings} servings):
        </h2>
        <div className="flex flex-row gap-1">
          <div>Calories: {perServing.calories.toFixed(2)}</div>
          <div>Fat: {perServing.fat.toFixed(2)}g</div>
          <div>Carbs: {perServing.carbs.toFixed(2)}g</div>
          <div>Protein: {perServing.protein.toFixed(2)}g</div>
        </div>
      </div>
    </div>
  );
}

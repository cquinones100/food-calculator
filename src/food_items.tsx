"use client";

import { use } from "react";
import { Ingredient, IngredientsContext } from "./app/IngredientsContext";
import Form from "./app/ingredients/new/form";

function FoodItem({
  ingredient,
  onDeleteIngredient,
}: {
  ingredient: Ingredient;
  onDeleteIngredient: () => void;
}) {
  return (
    <div className="border p-2 rounded mb-2 w-full flex justify-between">
      <div className="flex flex-col w-full">
        <div className="flex justify-end"></div>
        <div className="flex gap-2 justify-between flex-wrap items-center">
          <div className="font-bold text-xl flex-1">{ingredient.name}</div>
          <button className="rounded p-1" onClick={onDeleteIngredient}>
            <span className="text-white p-1 rounded flex text-xs">X</span>
          </button>
        </div>
        <div className="flex gap-2 flex-wrap justify-between">
          <div>Total Weight: {ingredient.totalWeight}g</div>
          <div>Serving Size: {ingredient.servingSize}g</div>
          <div>Calories: {ingredient.calories}</div>
          <div>Fat: {ingredient.fat}g</div>
          <div>Carbs: {ingredient.carbs}g</div>
          <div>Protein: {ingredient.protein}g</div>
        </div>
      </div>
    </div>
  );
}

export default function FoodItems() {
  const { ingredients, setIngredients } = use(IngredientsContext);

  function onFoodSubmit(food: Ingredient) {
    setIngredients([...ingredients, food]);
  }

  function onDeleteIngredient(food: Ingredient) {
    setIngredients(
      ingredients.filter((ingredient) => {
        return food.id !== ingredient.id;
      })
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex w-full items-end justify-end"></div>
      {ingredients.map((ingredient, index) => (
        <FoodItem
          key={index}
          ingredient={ingredient}
          onDeleteIngredient={() => {
            onDeleteIngredient(ingredient);
          }}
        />
      ))}
      <Form onFoodSubmit={onFoodSubmit} />
    </div>
  );
}

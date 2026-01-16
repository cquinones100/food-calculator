"use server";

import initializeDb, { Food, NewFood } from "@/database";

class FoodAlreadyExistsError extends Error {
  food: Food;

  constructor(food: Food) {
    super("Food already exists");
    this.food = food;
  }
}

async function saveFood(newFood: NewFood) {
  const db = await initializeDb();

  const { name, calories, fat, carbs, protein, servingSize } = newFood;

  let similarities: string[] = [];

  try {
    const existingFood = (
      await db
        .selectFrom("Foods")
        .where("name", "=", name)
        .selectAll()
        .limit(1)
        .execute()
    )[0];

    if (existingFood) {
      if (
        calories === existingFood.calories &&
        fat === existingFood.fat &&
        carbs === existingFood.carbs &&
        protein === existingFood.protein &&
        servingSize === existingFood.servingSize
      ) {
        throw new FoodAlreadyExistsError(existingFood);
      }
    }

    await db
      .insertInto("Foods")
      .values({
        name,
        calories,
        fat,
        carbs,
        protein,
        servingSize,
      })
      .execute();
  } catch (e) {
    if (e instanceof FoodAlreadyExistsError) {
      return {
        error: true,
        message: e.message,
        existingFood: { ...e.food },
        newFood: {
          ...e.food,
          calories,
          fat,
          carbs,
          protein,
        },
      };
    }

    if (e instanceof Error) {
      let message = e.message;

      return {
        error: true,
        message,
        similarities,
      };
    }

    throw e;
  }
}

export default saveFood;

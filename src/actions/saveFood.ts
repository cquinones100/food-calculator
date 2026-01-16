"use server";

import initializeDb, { NewFood } from "@/database";

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
        return;
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

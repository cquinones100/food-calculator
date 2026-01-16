"use server";

import initializeDb, { Food, NewFood } from "@/database";
import { isSimilar, similarityScore } from "../../lib/isSimilar";

class FoodIsSimilarError extends Error {}
class FoodAlreadyExistsError extends Error {
  food: Food;

  constructor(food: Food) {
    super("Food already exists");
    this.food = food;
  }
}

async function saveFood(
  { name, calories, fat, carbs, protein, servingSize }: NewFood,
  { forceSimilarity = false } = {}
) {
  const db = await initializeDb();


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
      throw new FoodAlreadyExistsError(existingFood);
    }

    if (!forceSimilarity) {
      for (const otherName of allNames) {
        if (isSimilar(name, otherName)) {
          similarities.push(otherName);
        }
      }
    }

    if (similarities.length > 0) {
      similarities = similarities.sort((a, b) => {
        const aSimilarityScore = similarityScore(name, a);
        const bSimilarityScore = similarityScore(name, b);

        return bSimilarityScore - aSimilarityScore;
      });

      throw new FoodIsSimilarError();
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
    if (e instanceof FoodIsSimilarError) {
      return {
        error: true,
        message: "Food name is similar to one that exists",
        similarities,
      };
    }

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

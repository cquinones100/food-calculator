"use server";

import { Food } from "@/models/food";
import { InferAttributes } from "sequelize";
import initializeDb from "@/database";
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
  { name, calories, fat, carbs, protein, servingSize }: InferAttributes<Food>,
  { forceSimilarity = false } = {}
) {
  const db = await initializeDb();
  const transaction = await db.transaction();

  const allNames = (
    await Food.findAll({
      attributes: ["name"],
    })
  ).map(({ dataValues: { name } }) => name);

  let similarities = [];

  try {
    const existingFood = await Food.findOne({ where: { name } });

    if (existingFood) {
      throw new FoodAlreadyExistsError(existingFood);
    }

    if (!forceSimilarity) {
      for (const otherName of allNames) {
        if (isSimilar(otherName, name)) {
          similarities.push(otherName);
        }
      }
    }

    if (similarities.length > 0) {
      similarities = similarities.sort((a, b) => {
        const aSimilarityScore = similarityScore(a, name);
        const bSimilarityScore = similarityScore(b, name);

        return bSimilarityScore - aSimilarityScore;
      });

      throw new FoodIsSimilarError();
    }

    await Food.create(
      {
        name,
        calories,
        fat,
        carbs,
        protein,
        servingSize,
      },
      {
        fields: ["name", "calories", "carbs", "fat", "protein"],
        transaction,
      }
    );

    transaction.commit();
  } catch (e) {
    await transaction.rollback();
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
        existingFood: { ...e.food.dataValues },
        newFood: {
          ...e.food.dataValues,
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

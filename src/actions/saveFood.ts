"use server";

import { Food } from "@/models/food";
import { Entry } from "@/models/entry";
import { InferAttributes } from "sequelize";
import initializeDb from "@/database";
import { isSimilar } from "../../lib/isSimilar";

class FoodIsSimilarError extends Error {}

async function saveFood(
  {
    name,
    calories,
    fat,
    carbs,
    protein,
    date,
    servingSize,
    totalWeight,
  }: InferAttributes<Food> & Omit<InferAttributes<Entry>, "food" | "foodId">,
  { forceSimilarity = false } = {}
) {
  const db = await initializeDb();
  const transaction = await db.transaction();

  const allNames = (
    await Food.findAll({
      attributes: ["name"],
    })
  ).map(({ dataValues: { name } }) => name);

  try {
    if (!forceSimilarity) {
      for (const otherName of allNames) {
        if (isSimilar(otherName, name)) {
          throw new FoodIsSimilarError();
        }
      }
    }

    const newFood = await Food.create(
      {
        name,
        calories,
        fat,
        carbs,
        protein,
      },
      {
        fields: ["name", "calories", "carbs", "fat", "protein"],
        transaction,
      }
    );

    await Entry.create(
      { foodId: newFood.dataValues.id, date, servingSize, totalWeight },
      {
        fields: ["date", "servingSize", "totalWeight"],
        transaction,
      }
    );

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    if (e instanceof FoodIsSimilarError) {
      return {
        error: true,
        message: "Food name is similar to one that exists",
      };
    }

    if (e instanceof Error) {
      return {
        error: true,
        message: e.message,
        similarities,
      };
    }

    throw e;
  }
}

export default saveFood;

"use server";

import { Food } from "@/models/food";
import { Entry } from "@/models/entry";
import { InferAttributes } from "sequelize";
import initializeDb from "@/database";
import { isSimilar, similarityScore } from "../../lib/isSimilar";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  let similarities = [];

  try {
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
    revalidatePath("/");
  } catch (e) {
    await transaction.rollback();
    if (e instanceof FoodIsSimilarError) {
      return {
        error: true,
        message: "Food name is similar to one that exists",
        similarities,
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

  redirect("/");
}

export default saveFood;

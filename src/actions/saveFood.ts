"use server";

import { Food } from "@/models/food";
import { Entry } from "@/models/entry";
import { InferAttributes } from "sequelize";

import initializeDb from "@/database";

async function saveFood({
  name,
  calories,
  fat,
  carbs,
  protein,
  date,
  servingSize,
  totalWeight,
}: InferAttributes<Food> & Omit<InferAttributes<Entry>, "food" | "foodId">) {
  const db = await initializeDb();
  const transaction = await db.transaction();

  try {
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
    if (e instanceof Error) {
      console.error(e.message);

      throw e;
    }
  }
}

export default saveFood;

"use server";

import initializeDb from "@/database";
import { Entry } from "@/models/entry";
import { Food } from "@/models/food";
import { Transaction } from "sequelize";

async function saveEntry({
  food,
  date,
  servingSize,
  totalWeight,
  transaction,
}: {
  food: Food | { name: string };
  date: Date;
  servingSize: number;
  totalWeight: number;
  transaction?: Transaction;
}) {
  initializeDb();
  let foodId: number;

  if (food instanceof Food) {
    foodId = food.dataValues.id;
  } else {
    const foundFood = await Food.findOne({ where: { name: food.name } });

    foodId = foundFood?.dataValues.id;
  }

  return (
    await Entry.create(
      { foodId, date, servingSize, totalWeight },
      {
        fields: ["foodId", "date", "servingSize", "totalWeight"],
        transaction,
      },
    )
  ).dataValues;
}

export default saveEntry;

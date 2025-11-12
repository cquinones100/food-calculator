"use server";

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
  food: Food;
  date: Date;
  servingSize: number;
  totalWeight: number;
  transaction: Transaction;
}) {
  return await Entry.create(
    { foodId: food.dataValues.id, date, servingSize, totalWeight },
    {
      fields: ["date", "servingSize", "totalWeight"],
      transaction,
    }
  );
}

export default saveEntry;

"use server";

import initializeDb from "@/database";
import { Food } from "@/models/food";
import { InferAttributes } from "sequelize";

async function updateFood({
  name,
  calories,
  carbs,
  fat,
  protein,
}: { name: string } & Omit<Partial<InferAttributes<Food>>, "name">) {
  await initializeDb();
  await Food.update(
    {
      calories,
      carbs,
      fat,
      protein,
    },
    {
      where: {
        name,
      },
    },
  );
}

export default updateFood;

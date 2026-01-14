"use server";

import initializeDb, { NewFood } from "@/database";

async function updateFood({
  name,
  calories,
  carbs,
  fat,
  protein,
  servingSize,
}: Omit<Partial<NewFood>, "name"> & { name: NewFood["name"] }) {
  const db = await initializeDb();
  await db
    .updateTable("Foods")
    .set({
      calories,
      carbs,
      fat,
      protein,
      servingSize,
    })
    .where("name", "=", name)
    .execute();
}

export default updateFood;

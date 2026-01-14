"use server";

import initializeDb from "@/database";

async function getFoods() {
  const db = await initializeDb();
  const foods = db.selectFrom("Foods").selectAll().execute();

  return foods;
}

export default getFoods;

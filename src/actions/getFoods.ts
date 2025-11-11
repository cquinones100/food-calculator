"use server";

import initializeDb from "@/database";
import { Food } from "@/models/food";

async function getFoods() {
  await initializeDb();
  const foods = await Food.findAll();

  return foods.map(({ dataValues }) => dataValues);
}

export default getFoods;

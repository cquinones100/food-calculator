"use server";

import initializeDb from "@/database";
import { isSimilar, similarityScore } from "../../lib/isSimilar";

export default async function getFoodsByName(name: string) {
  const db = await initializeDb();
  const allFoods = await db.selectFrom("Foods").selectAll().execute();

  const ordered = allFoods
    .filter((food) => {
      return isSimilar(name, food.name);
    })
    .sort((a, b) => {
      return similarityScore(name, b.name) - similarityScore(name, a.name);
    });

  return ordered;
}

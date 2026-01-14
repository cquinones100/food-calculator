import initializeDb from "@/database";
import { similarityScore } from "../../lib/isSimilar";

export default async function getFoodsByName(name: string) {
  const db = await initializeDb();
  const allFoods = await db.selectFrom("Foods").selectAll().execute();

  const ordered = allFoods.sort((a, b) => {
    return similarityScore(name, b.name) - similarityScore(name, a.name);
  });

  return ordered;
}

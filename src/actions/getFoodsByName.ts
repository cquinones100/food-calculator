import { Food } from "@/models/food";
import { similarityScore } from "../../lib/isSimilar";

export default async function getFoodsByName(name: string) {
  const allFoods = await Food.findAll();

  const ordered = allFoods.sort((a, b) => {
    return similarityScore(name, b.name) - similarityScore(name, a.name);
  });

  return ordered.map(({ dataValues }) => dataValues);
}

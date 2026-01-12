import { Food } from "@/models/food";
import { describe, expect, it } from "vitest";
import saveFood from "../saveFood";
import { foodFactory } from "../../../factories/food";

describe("saveFood", () => {
  it("saves a permanent food with the corresponding name", async () => {
    const name = "My Food";
    const calories = 100;
    const fat = 10;
    const carbs = 5;
    const protein = 5;
    const servingSize = 100;

    expect(await Food.findOne({ where: { name } })).toBe(null);

    await saveFood({
      name,
      calories,
      fat,
      carbs,
      protein,
      servingSize,
    });

    const foundFood = await Food.findOne({ where: { name } });
    expect(foundFood).not.toBe(null);
  });

  describe("submitting an item similar to others that exist", () => {
    it("rejects a similar item", async () => {
      const name = "My Food";

      const _existingFood = await foodFactory.create({
        name,
      });

      const similarName = name + " 2";
      await saveFood({
        name: similarName,
        calories: 100,
        fat: 10,
        carbs: 10,
        protein: 10,
        servingSize: 100,
      });

      const foundFood = await Food.findOne({ where: { name: similarName } });
      expect(foundFood).toBe(null);
    });

    it("returns a list of all of the similar items ordered by most similar", async () => {
      const names = [
        "my food 1",
        "my food 2 2",
        "my 1 2",
        "my food 4",
        "not related",
      ];

      for (const name of names) {
        await foodFactory.create({ name });
      }

      const similarName = "my food 2";
      const result = await saveFood({
        name: similarName,
        calories: 100,
        fat: 10,
        carbs: 10,
        protein: 10,
        servingSize: 100,
      });

      const foundFood = await Food.findOne({ where: { name: similarName } });
      expect(foundFood).toBe(null);

      expect(result?.similarities).toEqual([
        "my food 2 2",
        "my food 1",
        "my 1 2",
        "my food 4",
      ]);
    });

    it("allows the creation of a similar item when forceSimilarity is true", async () => {
      const name = "My Food";

      const _existingFood = await foodFactory.create({
        name,
      });

      const similarName = name + " 2";
      await saveFood(
        {
          name: similarName,
          calories: 100,
          fat: 10,
          carbs: 10,
          protein: 10,
          servingSize: 100,
        },
        {
          forceSimilarity: true,
        }
      );

      expect(await Food.findOne({ where: { name: similarName } })).not.toBe(
        null
      );
    });

    it("errors when name is identical and forceSimilarity is true", async () => {
      const name = "My Food";

      const existingFood = await foodFactory.create({
        name,
      });

      const date = new Date();

      const calories = 100;
      const fat = 10;
      const carbs = 10;
      const protein = 10;
      const servingSize = 100;

      const res = await saveFood(
        {
          name,
          calories,
          fat,
          carbs,
          protein,
          servingSize,
        },
        {
          forceSimilarity: true,
        }
      );

      const count = await Food.count({
        where: { name },
      });

      expect(count).toBe(1);

      expect(res).toEqual({
        error: true,
        message: "Food already exists",
        existingFood: {
          id: existingFood.id,
          name: existingFood.name,
          calories: existingFood.calories,
          fat: existingFood.fat,
          carbs: existingFood.carbs,
          protein: existingFood.protein,
          createdAt: existingFood.createdAt,
          updatedAt: existingFood.updatedAt,
          totalWeight: 20,
          servingSize: 20,
          date,
        },
        newFood: {
          id: existingFood.id,
          name: existingFood.name,
          createdAt: existingFood.createdAt,
          updatedAt: existingFood.updatedAt,
          calories,
          fat,
          carbs,
          protein,
          totalWeight: 20,
          servingSize: 20,
          date,
        },
      });
    });
  });
});

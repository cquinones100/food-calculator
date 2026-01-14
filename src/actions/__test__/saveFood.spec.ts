import { describe, expect, it } from "vitest";
import saveFood from "../saveFood";
import { foodFactory } from "../../../factories/food";
import initializeDb from "@/database";

describe("saveFood", () => {
  it("saves a permanent food with the corresponding name", async () => {
    const name = "My Food";
    const calories = 100;
    const fat = 10;
    const carbs = 5;
    const protein = 5;
    const servingSize = 100;

    const db = await initializeDb();
    expect(
      (
        await db
          .selectFrom("Foods")
          .selectAll()
          .where("name", "=", name)
          .execute()
      ).length
    ).toBe(0);

    await saveFood({
      name,
      calories,
      fat,
      carbs,
      protein,
      servingSize,
    });

    const foundFood = (
      await db
        .selectFrom("Foods")
        .selectAll()
        .where("name", "=", name)
        .execute()
    )[0];

    expect(foundFood).not.toBe(undefined);
  });

  describe("submitting an item similar to others that exist", () => {
    it.only("rejects a similar item", async () => {
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

      const db = await initializeDb();
      const foundFood = (
        await db
          .selectFrom("Foods")
          .selectAll()
          .where("name", "=", similarName)
          .execute()
      )[0];
      expect(foundFood).toBeUndefined();
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

      const db = await initializeDb();
      const foundFood = (
        await db
          .selectFrom("Foods")
          .selectAll()
          .where("name", "=", similarName)
          .execute()
      )[0];

      expect(foundFood).toBeUndefined();

      expect(result?.similarities).toEqual([
        "my food 2 2",
        "my 1 2",
        "my food 1",
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

      const db = await initializeDb();
      const foundFood = await db
        .selectFrom("Foods")
        .selectAll()
        .where("name", "=", name)
        .execute();
      expect(foundFood).not.toBe(null);
    });

    it("errors when name is identical and forceSimilarity is true", async () => {
      const name = "My Food";

      const now = new Date();

      const existingFood = await foodFactory.create({
        name,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
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

      const db = await initializeDb();
      const count = (
        await db
          .selectFrom("Foods")
          .select((eb) => eb.fn.count<number>("id").as("count"))
          .execute()
      )[0].count;

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
          servingSize: existingFood.servingSize,
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
          servingSize,
        },
      });
    });
  });
});

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

  describe("submitting a duplicate food", () => {
    it("permits the duplicate if the nutrition attributes are different", async () => {
      const name = "Ham";

      const commonAttributes = {
        name,
        fat: 10,
        carbs: 10,
        protein: 10,
        servingSize: 100,
      };

      const differentAttributes = [
        {
          calories: 100,
        },
        {
          calories: 1,
        },
      ];

      const _existingFood = await foodFactory.create({
        ...commonAttributes,
        ...differentAttributes[0],
      });

      await saveFood({
        ...commonAttributes,
        ...differentAttributes[1],
      });

      const db = await initializeDb();
      const foods = await db
        .selectFrom("Foods")
        .selectAll()
        .where("name", "=", name)
        .execute();

      expect(foods.length).toBe(2);
    });

    it.only("does not create a duplicate if all attributes are the same", async () => {
      const name = "Ham";

      const commonAttributes = {
        name,
        calories: 100,
        fat: 10,
        carbs: 10,
        protein: 10,
        servingSize: 100,
      };

      const _existingFood = await foodFactory.create({
        ...commonAttributes,
      });

      await saveFood({
        ...commonAttributes,
      });

      const db = await initializeDb();
      const foods = await db
        .selectFrom("Foods")
        .selectAll()
        .where("name", "=", name)
        .execute();

      expect(foods.length).toBe(1);
    });
  });
});

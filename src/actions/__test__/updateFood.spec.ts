import { describe, expect, it } from "vitest";
import { foodFactory } from "../../../factories/food";
import updateFood from "../updateFood";
import initializeDb, { NewFood } from "@/database";

describe("updateFood", () => {
  describe("updateFoodByName", () => {
    it.each<{
      field: keyof NewFood;
      initial: number;
      updated: number;
    }>([
      { field: "calories", initial: 123, updated: 200 },
      { field: "carbs", initial: 30, updated: 45 },
      { field: "fat", initial: 10, updated: 15 },
      { field: "protein", initial: 25, updated: 35 },
    ])(
      "can update a food's %s by name",
      async ({ field, initial, updated }) => {
        const name = "Banana";
        const existingFood = await foodFactory.create({
          name,
          [field]: initial,
        });

        await updateFood({ name, [field]: updated });

        const db = await initializeDb();

        const refreshedFood = (
          await db
            .selectFrom("Foods")
            .selectAll()
            .where("name", "=", name)
            .execute()
        )[0];

        expect(refreshedFood[field]).toBe(updated);
      }
    );
  });
});

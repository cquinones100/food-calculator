import { describe, expect, it } from "vitest";
import { foodFactory } from "../../../factories/food";
import { Entry } from "@/models/entry";
import saveEntry from "../saveEntry";

describe("saveEntry", () => {
  it("can associate itself to a food by name", async () => {
    const food = await foodFactory.create();

    expect(await Entry.count()).toBe(0);

    const entryDataValues = await saveEntry({
      food: {
        name: food.dataValues.name,
      },
      servingSize: 12,
      totalWeight: 12,
      date: new Date(),
    });

    expect(await Entry.count()).toBe(1);
    const entry = await Entry.findOne({ where: { id: entryDataValues.id } });
    expect((await entry?.$get("food"))?.name).toEqual(food.name);
  });
});

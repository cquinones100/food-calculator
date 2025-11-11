import { describe, it, expect } from "vitest";
import { foodFactory } from "../../../factories/food";
import getFoods from "../getFoods";

describe("getFoods", () => {
  it("retrieves all foods from the database", async () => {
    const foods = await foodFactory.createList(10);

    expect(await getFoods()).toEqual(foods.map(({ dataValues }) => dataValues));
  });
});

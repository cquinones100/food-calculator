import { describe, it, expect } from "vitest";
import { foodFactory } from "../../../factories/food";
import getFoodsByName from "../getFoodsByName";

describe("getFoodsByName", () => {
  it("retrieves all similar foods ordered by similarity", async () => {
    const foods = await Promise.all([
      foodFactory.create({ name: "ham and cheese sandwich" }),
      foodFactory.create({ name: "sandwich with ham" }),
      foodFactory.create({ name: "ham" }),
    ]);

    const retrieved = await getFoodsByName("ham");
    const expected = [foods[2], foods[1], foods[0]];

    expect(retrieved).toEqual(expected);
  });
});

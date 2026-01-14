import initializeDb, { Food, NewFood } from "@/database";
import { Factory } from "fishery";

export const foodFactory = Factory.define<Food | NewFood>(
  ({ params, sequence, onCreate }) => {
    const food: NewFood = {
      name: params.name ?? `food-${sequence}`,
      calories: 100,
      fat: 10,
      carbs: 5,
      protein: 5,
      servingSize: 100,
    };

    onCreate(async () => {
      const db = await initializeDb();

      const createdFood = await db
        .insertInto("Foods")
        .values(food)
        .returningAll()
        .execute();

      return createdFood[0];
    });

    return food;
  }
);

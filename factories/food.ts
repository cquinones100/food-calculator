import initializeDb, { Food, NewFood } from "@/database";
import { Factory } from "fishery";

export const foodFactory = Factory.define<Food | NewFood>(
  ({ sequence, onCreate }) => {
    const food: NewFood = {
      name: `food-${sequence}`,
      calories: 100,
      fat: 10,
      carbs: 5,
      protein: 5,
      servingSize: 100,
    };

    onCreate(async () => {
      const db = await initializeDb();

      await db.insertInto("Foods").values(food).execute();

      return food;
    });

    return food;
  }
);

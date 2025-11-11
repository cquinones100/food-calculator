import { Food } from "@/models/food";
import { InferAttributes } from "sequelize";
import { Factory } from "fishery";

type FoodType = InferAttributes<Food>;

export const foodFactory = Factory.define<Food>(({ sequence, onCreate }) => {
  const attributes: FoodType = {
    name: `food-${sequence}`,
    calories: 100,
    fat: 10,
    carbs: 5,
    protein: 5,
  };

  const food = Food.build(attributes);

  onCreate(async () => {
    return await food.save();
  });

  return food;
});

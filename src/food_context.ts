import { createContext } from "react";
import type { Food } from "./food_items";

export const FoodContext = createContext<{
  foods: Food[];
  setFoods: (foods: Food[]) => void;
}>({
  foods: [],
  setFoods: () => {},
});

"use client";

import { createContext } from "react";
import getFoods from "./actions/getFoods";

export const FoodContext = createContext<{
  foods: Awaited<ReturnType<typeof getFoods>>;
}>({
  foods: [],
});

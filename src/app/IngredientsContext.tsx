"use client";

import { NewFood } from "@/database";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";
import { ServingAttributes } from "./ingredients/new/form";

export type Ingredient = NewFood & ServingAttributes;

type IngredientsContextType = {
  ingredients: Ingredient[];
  setIngredients: Dispatch<SetStateAction<Ingredient[]>>;
};

export const IngredientsContext = createContext<IngredientsContextType>({
  ingredients: [],
  setIngredients: () => {},
});

export default function IngredientsContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  return (
    <IngredientsContext value={{ ingredients, setIngredients }}>
      {children}
    </IngredientsContext>
  );
}

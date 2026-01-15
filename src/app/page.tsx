import FoodItems from "@/food_items";
import TotalPerServing from "@/total_per_serving";
import IngredientsContextProvider from "./IngredientsContext";

export default async function Home() {
  return (
    <div className="flex flex-col items-center p-4 w-full gap-2 h-screen">
      <h1 className="text-3xl font-bold">Food Calculator</h1>
      <div className="flex flex-col items-center gap-2 grow w-full">
        <IngredientsContextProvider>
          <div className="flex w-full max-w-5xl flex-col justify-center gap-2">
            <TotalPerServing />
            <FoodItems />
          </div>
        </IngredientsContextProvider>
      </div>
    </div>
  );
}

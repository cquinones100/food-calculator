import getFoods from "@/actions/getFoods";
import FoodItems from "@/food_items";
import TotalPerServing from "@/total_per_serving";

export default async function Home() {
  const foods = await getFoods();

  return (
    <div className="flex flex-col p-4 w-full gap-2 h-screen">
      <h1 className="text-3xl font-bold">Food Calculator</h1>
      <div className="flex flex-col items-center gap-2 grow">
        <div className="flex">
          <TotalPerServing foods={foods} />
        </div>
        <FoodItems foods={foods} />
      </div>
    </div>
  );
}

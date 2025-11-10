"use server";

import { revalidatePath } from "next/cache";
import saveFood from "./actions/saveFood";
import { redirect } from "next/navigation";

function Input({
  label,
  id,
  type,
}: {
  label: string;
  id: string;
  type: "text" | "number";
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        type={type}
        placeholder={label}
        className="border p-2 rounded max-w-[150px]"
        id={id}
        name={id}
      />
    </>
  );
}

export default async function Form() {
  async function onSubmit(formData: FormData) {
    "use server";

    await saveFood({
      name: String(formData.get("food-name"))!,
      calories: Number(formData.get("calories")!),
      carbs: Number(formData.get("carbs")!),
      fat: Number(formData.get("fat")!),
      protein: Number(formData.get("protein")!),
      servingSize: Number(formData.get("serving-size")!),
      totalWeight: Number(formData.get("total-weight")!),
      date: new Date(),
    });

    revalidatePath("/");
    redirect("/");
  }

  return (
    <form
      action={onSubmit}
      className="flex flex-wrap gap-2 justify-center align-middle"
    >
      <Input label="Food Name" id="food-name" type="text" />
      <Input label="Total Weight (g)" id="total-weight" type="number" />
      <Input label="Serving Size (g)" id="serving-size" type="number" />
      <Input label="Calories" id="calories" type="number" />
      <Input label="Fat (g)" id="fat" type="number" />
      <Input label="Carbs (g)" id="carbs" type="number" />
      <Input label="Protein (g)" id="protein" type="number" />
      <input
        type="submit"
        value="Add Food"
        className="bg-blue-500 text-white p-2 rounded"
      />
    </form>
  );
}

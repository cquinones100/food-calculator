import Form from "@/form";

export default async function New() {
  return (
    <div className="flex flex-col p-2 gap-2 h-screen">
      <div className="flex justify-end">
        <a href="/">
          <button className="rounded p-1">
            <span className="text-white p-1 rounded flex text-xs">X</span>
          </button>
        </a>
      </div>
      <Form />
    </div>
  );
}

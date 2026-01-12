import initializeDb, { dropDb } from "@/database";
import serverOnly from "@/scripts/serverOnly";
import createFoods from "@/database/migrations/createFoods";

async function resetDb(silent?: boolean) {
  function log(message: string) {
    if (silent) return;

    console.log(message);
  }

  await serverOnly();

  await dropDb();
  log("Database dropped");
  await initializeDb();
  await createFoods();

  log("Database connected and tables created!");
}

export default resetDb;

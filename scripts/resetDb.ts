import { Food } from "@/models/food";
import { Entry } from "@/models/entry";
import initializeDb from "@/database";
import serverOnly from "./serverOnly";

async function resetDb(silent?: boolean) {
  function log(message: string) {
    if (silent) return;

    console.log(message);
  }

  await serverOnly();

  const db = await initializeDb();
  await Food.drop();
  await Entry.drop();

  log("Database dropped");
  try {
    await db.sync({ force: true });
    log("Database connected and tables created!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default resetDb;

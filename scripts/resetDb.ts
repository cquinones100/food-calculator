import { Food } from "@/models/food";
import { Entry } from "@/models/entry";
import initializeDb from "@/database";
import serverOnly from "./serverOnly";

async function resetDb() {
  await serverOnly();

  const db = await initializeDb();
  await Food.drop();
  await Entry.drop();

  console.log("Database dropped");
  try {
    await db.sync({ force: true });
    console.log("Database connected and tables created!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default resetDb;

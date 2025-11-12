import initializeDb, { dropDb } from "@/database";
import serverOnly from "./serverOnly";
import { unlink } from "fs/promises";

async function resetDb(silent?: boolean) {
  function log(message: string) {
    if (silent) return;

    console.log(message);
  }

  await serverOnly();

  await dropDb();
  const db = await initializeDb();
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

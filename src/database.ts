import { Sequelize } from "sequelize-typescript";
import { Food } from "@/models/food";
import { Entry } from "./models/entry";
import setEnvironment from "../scripts/setEnvironment";

let db: Sequelize;

async function initializeDb() {
  if (process.env.NEXT_RUNTIME) {
    await import("server-only");
  }

  setEnvironment();

  if (db) {
    return db;
  }

  const storage = process.env.DATABASE_URL;

  db = new Sequelize({
    storage,
    dialect: "sqlite",
    logging: false,
  });

  db.addModels([Food, Entry]);

  return initializeDb();
}

export default initializeDb;

import { Sequelize } from "sequelize-typescript";
import { Food } from "@/models/food";
import { Entry } from "./models/entry";

let db: Sequelize;

async function initializeDb() {
  if (process.env.NEXT_RUNTIME) {
    await import("server-only");
  }

  if (db) {
    return db;
  }

  db = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
  });

  db.addModels([Food, Entry]);

  return initializeDb();
}

export default initializeDb;

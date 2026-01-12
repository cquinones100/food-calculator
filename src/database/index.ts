import { unlink } from "fs/promises";
import Database from "better-sqlite3";
import {
  Generated,
  Insertable,
  Kysely,
  Selectable,
  SqliteDialect,
  Transaction,
  Updateable,
} from "kysely";
import setEnvironment from "@/scripts/setEnvironment";

export interface FoodTable {
  id: Generated<number>;
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  servingSize: number;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
}

export interface DatabaseSchema {
  Foods: FoodTable;
}

export type Food = Selectable<FoodTable>;
export type NewFood = Insertable<FoodTable>;
export type FoodUpdate = Updateable<FoodTable>;

export type DbOrTx = Kysely<DatabaseSchema> | Transaction<DatabaseSchema>;

let db: Kysely<DatabaseSchema> | undefined;

export async function dropDb() {
  setEnvironment();

  const storage = process.env.DATABASE_URL;

  if (db) {
    await db.destroy();
    db = undefined;
  }

  try {
    await unlink(storage!);
  } catch (e) {}
}

async function initializeDb() {
  if (process.env.NEXT_RUNTIME) {
    await import("server-only");
  }

  setEnvironment();

  if (db) {
    return db;
  }

  const storage = process.env.DATABASE_URL;

  db = new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
      database: new Database(storage),
    }),
  });

  return db;
}

export default initializeDb;

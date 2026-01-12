import { sql } from "kysely";
import initializeDb from "..";

export default async function createFoods() {
  const db = await initializeDb();

  await db.schema
    .createTable("Foods")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("name", "text", (col) => col.notNull().unique())
    .addColumn("calories", "real", (col) => col.notNull())
    .addColumn("fat", "real", (col) => col.notNull())
    .addColumn("carbs", "real", (col) => col.notNull())
    .addColumn("protein", "real", (col) => col.notNull())
    .addColumn("createdAt", "text", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn("updatedAt", "text", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn("servingSize", "integer", (col) => col.notNull())
    .execute();
}

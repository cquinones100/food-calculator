"use server";

import initializeDb from "@/database";
import { Food } from "@/models/food";
import { Entry } from "@/models/entry";
async function setup() {
  if (process.env.NEXT_RUNTIME) {
    await import("server-only");
  }

  const db = await initializeDb();
  await Food.drop();
  await Entry.drop();

  console.log("Database dropped");

  try {
    await db.sync({ force: true });
    console.log("Database connected and tables created!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setup();

import initializeDb from "@/database";
import { beforeEach } from "vitest";
import resetDb from "./scripts/resetDb";

beforeEach(async () => {
  await initializeDb();
  await resetDb(true);
});

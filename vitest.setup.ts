import initializeDb from "@/database";
import { beforeEach } from "vitest";
import resetDb from "@/database/scripts/resetDb";

beforeEach(async () => {
  await initializeDb();
  await resetDb(true);
});

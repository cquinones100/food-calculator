"use server";

import serverOnly from "./serverOnly";
import resetDb from "./resetDb";

async function setup() {
  await serverOnly();

  await resetDb();
}

setup();

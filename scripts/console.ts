import initializeDb from "@/database";
import repl from "repl";
import { Food } from "@/models/food";
import { Entry } from "@/models/entry";
import serverOnly from "./serverOnly";

async function start() {
  await serverOnly();
  await initializeDb();

  const r = repl.start({ useGlobal: true, useColors: true });
  Object.assign(r.context, {
    Food,
    Entry,
  });
}

start();

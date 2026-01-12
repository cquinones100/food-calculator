import initializeDb from "@/database";
import repl from "repl";
import { Food } from "@/models/food";
import serverOnly from "./serverOnly";
import setEnvironment from "./setEnvironment";

async function start() {
  setEnvironment();
  await serverOnly();
  await initializeDb();

  const r = repl.start({ useGlobal: true, useColors: true });
  Object.assign(r.context, {
    Food,
  });
}

start();

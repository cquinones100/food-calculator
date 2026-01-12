import initializeDb from "@/database";
import repl from "repl";
import serverOnly from "./serverOnly";
import setEnvironment from "./setEnvironment";

async function start() {
  setEnvironment();
  await serverOnly();
  const db = await initializeDb();

  const r = repl.start({ useGlobal: true, useColors: true });
  Object.assign(r.context, {
    db,
  });
}

start();

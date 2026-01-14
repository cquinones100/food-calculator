import { config } from "dotenv";
import { resolve } from "path";

let configured = false;
function setEnvironment() {
  if (!configured) {
    let file;

    if (!process.env.NODE_ENV) {
      file = `.env.development`;
    } else {
      file = `.env.${process.env.NODE_ENV}`;
    }

    config({
      path: resolve(process.cwd(), file),
      quiet: true,
    });

    configured = true;
  }
}

export default setEnvironment;

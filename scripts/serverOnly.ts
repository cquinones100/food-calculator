"use server";

async function serverOnly() {
  if (process.env.NEXT_RUNTIME) {
    await import("server-only");
  }
}

export default serverOnly;

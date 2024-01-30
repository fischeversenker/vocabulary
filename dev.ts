#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import { load } from "https://deno.land/std@0.213.0/dotenv/mod.ts";
import config from "./fresh.config.ts";

await load({ export: true });

const origConsoleError = console.error;
console.error = (msg) => {
  if (typeof msg === "string" && msg.includes("Improper nesting of table")) {
    return;
  }
  origConsoleError(msg);
};

await dev(import.meta.url, "./main.ts", config);

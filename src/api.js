import { EventEmitter } from "events";
import { readdirSync } from "fs";

import { Event, Level, log } from "./events.js";


/** @type {EventEmitter} */ const api = new EventEmitter();
export default api;

// import api/* default exports
await Promise.all([...readdirSync(new URL("api/", import.meta.url)).map((file) => import(new URL(`api/${file}`, import.meta.url)))]).then((modules) => {
  let listeners = 0;
  for (const exports of modules) {
    for (const [event, listener] of Object.entries(exports.default)) {
      api.on(event, listener);
      listeners++;
    }
  }

  log(new Event(Level.info, "api", `Loaded ${listeners} listeners`));
});


/** @type {string[]} */ export const protocols = ["dev"];
api.protocols = protocols;

log(new Event(Level.info, "api", `Handling protocols: ${protocols.join(", ")}`));

import https from "https";

import { server as settings } from "./settings.js";
import { Event, log } from "./events.js";
import time from "./time.js";
import { upgrade } from "./socket.js";
import app from "./app.js";


/** @type {https.Server} */
const server = https.createServer(
  {
    key: settings.key,
    cert: settings.cert
  },
  app
);
export default server;

server.on("upgrade", upgrade);

server.maxConnections = settings.maxConnections;
server.setTimeout(settings.timeout);
server.listen({
  ipv6Only: settings.ipv6Only,
  host: settings.host,
  port: settings.port
});


time.run(time.start);

log(new Event("info", "server", "Started"));

import https from "https";

import app from "./app.js";
import { Event, Level, log } from "./events.js";
import { server as settings } from "./settings.js";
import { upgrade } from "./socket.js";
import time from "./time.js";


/** @type {https.Server} */ const server = https.createServer(
  {
    key: settings.key,
    cert: settings.cert
  },
  app
);
export default server;

server.maxConnections = settings.maxConnections;
server.setTimeout(settings.timeout);
server.on("upgrade", upgrade);
server.listen({
  ipv6Only: settings.ipv6Only,
  host: settings.host,
  port: settings.port
});


time.run(time.start);

log(new Event(Level.info, "server", "Started"));

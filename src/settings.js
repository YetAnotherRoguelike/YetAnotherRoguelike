import fs from "fs";


/**
 * @typedef {Object} Stream
 * @property {stream.Writable} stream
 * @property {"error" | "warn" | "info" | "debug"} level
 * @property {"object" | "string" | "serialized"} format
 * @property {boolean} [trace=false]
 * @property {boolean} [console=false]
 * @property {boolean} [persistent=false]
 */
export const events = {
  /** @type {Stream[]} */
  streams: [],

  /** @type {Stream} */
  console: {
    stream: process.stdout,
    level: "info",
    format: "string",
    console: true
  }
};
events.streams.push(events.console);

export const time = {
  /** @type {number} ms interval to update server */
  tickRate: 50,
  /** @type {number} tick drift allowance before time sync, Infinity to disable */
  tickDriftThreshold: 10
};


/** @typedef {"<address>" | "<start>-<end>" | "<network>/<prefix>"} Rule */
export const auth = {
  /** @type {Rule[]} */
  blacklist: [],

  /** @type {boolean} deny unless on whitelist */
  enforceWhitelist: false,
  /** @type {Rule[]} */
  whitelist: [],
  /** @type {boolean} bypass server password */
  alwaysPermitWhitelist: true,

  /** @type {boolean} */
  enforceServerPassword: true,
  /** @type {string} null to assign randomly */
  serverPassword: null,
  /** @type {number} */
  serverPasswordBytes: 4,
  /** @type {string} base64url or hex */
  serverPasswordEncoding: "base64url",
  /** @type {boolean} removes lowercase and special characters when assigning randomly */
  serverPasswordSimple: true,

  /** @type {string} null to assign randomly */
  tokenSecret: null,
  /** @type {number} */
  tokenSecretBytes: 64,
  /** @type {string} base64url or hex */
  tokenSecretEncoding: "base64url",

  /** @type {number} */
  tokenBytes: 128,
  /** @type {string} base64url or hex */
  tokenEncoding: "base64url",
  /** @type {number} ms */
  tokenTimeout: (15 * 60 * 1000), // 15 mins

  /** @type {number} ms */
  tokensCleanInterval: (15 * 60 * 1000) // 15 mins
};

export const audit = {
  /** @type {boolean} prevent logging violations against whitelisted IPs */
  pardonWhitelist: true,

  /** @type {number} */
  minorViolationDuration: (1 * 60 * 60 * 1000), // 1 hour
  /** @type {number} */
  majorViolationDuration: (24 * 60 * 60 * 1000), // 24 hours

  /** @type {number} */
  maxActiveViolations: 10,
  /** @type {number} */
  maxTotalViolations: 25
};

export const connections = {
  /** @type {number} max WebSocket clients to permit */
  max: 50,
  /** @type {number} ^ per IP */
  maxIP: 10
};


export const socket = {
  /** @type {boolean} require HTTPS tokens to connect */
  validateTokens: true,

  /** @type {number} ms delay */
  pingInterval: (15 * 1000), // 15 secs
  /** @type {number} ms delay, checked every pingInterval */
  pingTimeout: (60 * 1000), // 1 min

  /** @type {number} bytes */
  maxPayload: (1 * 1024 * 1024), // 1 MB

  /** @type {number} max messages allowed in period */
  maxRate: 500,
  /** @type {number} period size in ms */
  maxRateWindow: (60 * 1000) // 1 min
};


export const server = {
  /** @type {number} */
  ipv6Only: false,
  /** @type {string} */
  host: "0.0.0.0",
  /** @type {number} */
  port: 443,

  /** @type {string} */
  key: fs.readFileSync(new URL("cert/cert.key", import.meta.url), "utf8"),
  /** @type {string} */
  cert: fs.readFileSync(new URL("cert/cert.pem", import.meta.url), "utf8"),

  /** @type {number} max allowable sockets */
  maxConnections: 100,
  /** @type {number} ms delay */
  timeout: (2 * 60 * 1000) // 2 mins
};


export default {
  events,
  time,

  auth,
  audit,
  connections,

  socket,

  server
};

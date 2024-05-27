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


export default {
  events,
  time
};

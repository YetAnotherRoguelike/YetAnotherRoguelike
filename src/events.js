import { events as settings } from "./settings.js";


/** @enum {number} */
export const Level = class {
  static error = 0;
  static warn = 1;
  static info = 2;
  static debug = 3;
};

export const Event = class extends Error {
  /** @type {keyof Level} */
  #level;
  /** @type {string} */
  #module;
  /** @type {number} */
  #time;

  /**
   * @typedef {Object} Options
   * @property {*} cause
   */
  /**
   * @param {keyof Level} level
   * @param {string} module
   * @param {string} message
   * @param {Options} options
   */
  constructor (level, module, message, options) {
    super(message, options);
    this.name = "Event";

    this.#level = level;
    this.#module = module;
    this.#time = (performance.timeOrigin + performance.now());

    Error.captureStackTrace(this, Event);
  }

  /**
   * @param {Object} json
   * @returns {Event}
   */
  static fromJSON (json) {
    return new Event(json.level, json.module, json.message, { cause: json.cause }).fromJSON(json);
  }


  /** @type {keyof Level} */
  get level () { return this.#level; }

  /** @type {string} */
  get module () { return this.#module; }

  /** @type {number} */
  get time () { return this.#time; }


  /**
   * @param {Object} json
   * @returns {Event}
   */
  fromJSON (json) {
    this.name = json.name;
    this.message = json.message;
    this.stack = json.stack;
    this.cause = json.cause;

    this.#level = json.level;
    this.#module = json.module;
    this.#time = json.time;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      cause: (this.cause.toJSON?.() ?? this.cause),

      level: this.level,
      module: this.module,
      time: this.time
    };
  }
};


/** @type {Event[]} */
export const events = [];

/**
 * @param {Event} event
 * @param {(stream) => boolean} [filter]
 * @returns {undefined}
 */
export const log = (event, filter = () => true) => {
  events.push(event);

  const filtered = settings.streams.filter((stream) => (Level[event.level] <= Level[stream.level])).filter(filter);
  for (const stream of filtered) {
    let data = event;
    if (stream.format === "serialized") {
      data = event.toJSON();
    }
    else if (stream.format === "string") {
      const message = (stream.trace) ? event.stack : `${event.module}: ${event.message}`;
      data = `${new Date(event.time).toISOString()} [${event.level}] ${message}\n`;
    }

    stream.stream.emit("reset");
    stream.stream.write(data);
    stream.stream.emit("write");
  }
};


export default {
  Level,
  Event,

  events,
  log
};

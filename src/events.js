import { fromJSON, toJSON, serializable } from "@kxirk/serialize";

import { events as settings } from "./settings.js";


/**
 * @enum {string}
 */
export const Level = class {
  // #region Enum
  static error = "error";
  static warn = "warn";
  static info = "info";
  static debug = "debug";


  /**
   * @returns {Iterator<string>}
   */
  static* [Symbol.iterator] () {
    yield this.error;
    yield this.warn;
    yield this.info;
    yield this.debug;
  }
  // #endregion
};

/** @type {string[]} */ export const levels = [...Level];
Object.defineProperty(levels, "indexes", {
  /**
   * @enum {number}
   */
  value: Object.fromEntries(levels.map((size, i) => [size, i])),
  enumerable: false
});


/**
 * @extends Error
 */
export const Event = class extends Error {
  // #region Instance
  /** @type {Level} */ #level;
  /** @type {string} */ #module;
  /** @type {number} */ #time;


  /**
   * @typedef {Object} Options
   * @property {*} cause
   */
  /**
   * @param {Level} level
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

    Error.captureStackTrace(this, this.constructor);
  }
  // #endregion

  // #region Instance Accessors
  /** @type {Level} */
  get level () { return this.#level; }

  /** @type {string} */
  get module () { return this.#module; }

  /** @type {number} */
  get time () { return this.#time; }
  // #endregion


  // #region Serialize
  /** @type {string[]} */ static parameters = ["level", "module", "message", "options"];


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    this.name = fromJSON(json, this, "name", reviver?.name);
    this.code = fromJSON(json, this, "code", reviver?.code);
    this.message = fromJSON(json, this, "message", reviver?.message);
    this.stack = fromJSON(json, this, "stack", reviver?.stack);
    this.cause = fromJSON(json.options, this, "cause", reviver?.cause);

    this.#level = fromJSON(json, this, "level", reviver?.level);
    this.#module = fromJSON(json, this, "module", reviver?.module);
    this.#time = fromJSON(json, this, "time", reviver?.time);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.name = toJSON(this, "name", replacer?.name);
    json.code = toJSON(this, "code", replacer?.code);
    json.message = toJSON(this, "message", replacer?.message);
    json.stack = toJSON(this, "stack", replacer?.stack);
    json.options = { cause: toJSON(this, "cause", replacer?.cause) };

    json.level = toJSON(this, "level", replacer?.level);
    json.module = toJSON(this, "module", replacer?.module);
    json.time = toJSON(this, "time", replacer?.time);

    return json;
  }
  // #endregion
};
serializable(Event);


/** @type {Event[]} */ export const events = [];
Object.defineProperty(events, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  value (json, reviver) {
    return Array.prototype.fromJSON.call(this, json, (reviver ?? { value: Event.fromJSON }), false);
  },
  enumerable: false
});

/**
 * @param {Event} event
 * @param {(stream) => boolean} [filter]
 * @returns {undefined}
 */
export const log = (event, filter = () => true) => {
  events.push(event);

  const filtered = settings.streams.filter((stream) => (levels.indexes[event.level] <= levels.indexes[stream.level])).filter(filter);
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
  levels,

  Event,

  events,
  log
};
